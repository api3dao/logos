const chains = require('@api3/chains');
const feeds = require('../data/feeds.json');
const fs = require('fs/promises');
const rimraf = require('rimraf');
const babel = require('@babel/core');
const utils = require('../helpers/utils');
const { rename } = require('fs');
const apiIntegrations = require('@api3/api-integrations')

const outputPath = './dist';

async function buildChainLogos(files, logosDir, format = 'esm', dir) {
    chains.CHAINS.forEach(async (chain) => {
        utils.buildChainLogos(chain.id, chain.testnet, files, logosDir, format, dir);
    });
    utils.buildChainLogos('Placeholder', false, files, logosDir, format, dir);
}

async function buildApiProviderLogos(files, logosDir, format = 'esm', dir) {
    apiIntegrations.getApiProviderAliases().forEach(async (provider) => {
        utils.buildSymbolLogos(provider, files, logosDir, format, dir);
    });
    utils.buildSymbolLogos('placeholder', files, logosDir, format, dir);
}

async function buildSymbolLogos(files, logosDir, format = 'esm', dir) {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];

    symbols.forEach(async (symbol) => {
        utils.buildSymbolLogos(symbol, files, logosDir, format, dir);
    });
    utils.buildSymbolLogos('placeholder', files, logosDir, format, dir);
}

async function buildLogos(format = 'esm', dir, mode, batchName) {
    let outDir = `${outputPath}/${format}`;
    let logosDir = `${outDir}/logos/${mode || ''}`;

    await fs.mkdir(outDir, { recursive: true });
    await fs.mkdir(logosDir, { recursive: true });

    const files = await fs.readdir(dir, 'utf-8');

    switch (mode) {
        case 'chains':
            await buildChainLogos(files, logosDir, format, dir);
            break;
        case 'symbols':
            await buildSymbolLogos(files, logosDir, format, dir);
            break;
        case 'api-providers':
            await buildApiProviderLogos(files, logosDir, format, dir);
            break;
        default:
            break;
    }

    await buildBatch(outDir, format, batchName, mode);

    await fs.appendFile(`${outDir}/index.js`, utils.indexFileContent(format, batchName), 'utf-8');
    await fs.appendFile(`${outDir}/index.d.ts`, utils.indexFileContent('esm', batchName), 'utf-8');

    await fs.appendFile(`${outDir}/index.js`, utils.indexFileContent(format, batchName + 'Base64'), 'utf-8');
    await fs.appendFile(`${outDir}/index.d.ts`, utils.indexFileContent('esm', batchName + 'Base64'), 'utf-8');
}

function buildSwitchCase(mode, isBase64) {
    switch (mode) {
        case 'chains':
            const chainsIds = chains.CHAINS.map((chain) => chain.id);
            return utils.generateSwitchCase(chainsIds, 'Chain', isBase64);
        case 'symbols':
            const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
            return utils.generateSwitchCase(symbols, 'Symbol', isBase64);
        case 'api-providers':
            const apiProviders = apiIntegrations.getApiProviderAliases();
            return utils.generateSwitchCase(apiProviders, 'ApiProvider', isBase64);
        default:
            break;
    }
}

function buildLogoImports(mode, postfix, format) {
    switch (mode) {
        case 'chains':
            let chainIds = chains.CHAINS.map((chain) => chain.id);
            chainIds.push('placeholder');
            return utils.generateImports(chainIds, 'Chain', 'Chain', postfix, 'chains', format);
        case 'symbols':
            let symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
            symbols.push('placeholder');
            return utils.generateImports(symbols, 'Symbol', '', postfix, 'symbols', format);
        case 'api-providers':
            let providers = apiIntegrations.getApiProviderAliases().map((provider) => provider);
            providers.push('placeholder');
            return utils.generateImports(providers, 'ApiProvider', '', postfix, 'api-providers', format);
        default:
            break;
    }
}

async function buildBatch(outDir, format = 'esm', batchName, mode) {
    const types = `import * as React from 'react';\ndeclare function ${batchName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${batchName};\n`;
    await fs.writeFile(`${outDir}/${batchName}.d.ts`, types, 'utf-8');

    const imports = `import * as React from "react";\nimport camelcase from 'camelcase';
        ${buildLogoImports(mode, '', format)}`;

    let code = await babelTransform(imports, batchName, mode, false);

    if (format === 'cjs') {
        code = code
            .replace('import * as React from "react";', 'const React = require("react");')
            .replace(`import camelcase from 'camelcase'`, `const camelcase = require('camelcase')`)
            .replace('export default', 'module.exports =');
    }

    await fs.writeFile(`${outDir}/${batchName}.js`, code, 'utf-8');

    //BASE64
    const typesBase64 = `declare function ${batchName}Base64(id: string): string;\nexport default ${batchName}Base64;\n`;
    await fs.writeFile(`${outDir}/${batchName}Base64.d.ts`, typesBase64, 'utf-8');

    const importsBase64 = `import camelcase from 'camelcase';${buildLogoImports(mode, 'Base64', format)}`;

    let codeBase64 = await babelTransform(importsBase64, batchName + 'Base64', mode, true);
    if (format === 'cjs') {
        codeBase64 = codeBase64
            .replace('export default', 'module.exports =')
            .replace(`import camelcase from 'camelcase'`, `const camelcase = require('camelcase')`);
    }

    await fs.writeFile(`${outDir}/${batchName}Base64.js`, codeBase64, 'utf-8');
}

async function babelTransform(imports, batchName, mode, isBase64) {
    let { code } = await babel.transformAsync(
        `
        ${imports}
        ${utils.generateFunction(batchName, buildSwitchCase(mode, isBase64), mode, isBase64)}`,
        {
            presets: [['@babel/preset-react', { useBuiltIns: true }]]
        }
    );

    return code;
}

async function renameFiles(dir) {
    const files = await fs.readdir(dir, 'utf-8');
    files.forEach((file) => {
        rename(dir + '/' + file, dir + '/' + utils.sanitizeName(file) + '.svg', function (err) {
            if (err) console.log('Error: ' + err);
        });
    });
}

async function generateLogos(format = 'esm') {
    await renameFiles('./optimized/symbols');
    await renameFiles('./optimized/chains');
    await renameFiles('./optimized/api-providers');

    await buildLogos(format, './optimized/chains', 'chains', 'ChainLogo');
    await buildLogos(format, './optimized/symbols', 'symbols', 'SymbolLogo');
    await buildLogos(format, './optimized/api-providers', 'api-providers', 'ApiProviderLogo');
}

(function main() {
    console.log('🏗 Building logo package...');
    new Promise((resolve) => {
        rimraf(`${outputPath}/*`, resolve);
    })
        .then(() => Promise.all([generateLogos('cjs'), generateLogos('esm')]))
        .then(() => console.log('✅ Finished building package.'));
})();
