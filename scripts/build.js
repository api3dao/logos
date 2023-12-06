const chains = require('@api3/chains');
const feeds = require('../data/feeds.json');
const fs = require('fs/promises');
const rimraf = require('rimraf');
const babel = require('@babel/core');
const utils = require('../helpers/utils');
const { rename } = require('fs');
const apiIntegrations = require('@api3/api-integrations');

const outputPath = './dist';

async function buildChainLogos(files, logosDir, format = 'esm', dir) {
    chains.CHAINS.forEach(async (chain) => {
        utils.buildLogos(chain.id, chain.testnet, files, logosDir, format, dir, 'Chain');
    });
    utils.buildLogos('Placeholder', false, files, logosDir, format, dir, 'Chain');
}

async function buildApiProviderLogos(files, logosDir, format = 'esm', dir) {
    apiIntegrations.getApiProviderAliases().forEach(async (provider) => {
        utils.buildLogos(provider, false, files, logosDir, format, dir);
    });
    utils.buildLogos('placeholder', false, files, logosDir, format, dir);
}

async function buildSymbolLogos(files, logosDir, format = 'esm', dir) {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];

    symbols.forEach(async (symbol) => {
        utils.buildLogos(symbol, false, files, logosDir, format, dir);
    });
    utils.buildLogos('placeholder', false, files, logosDir, format, dir);
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

    await buildBatch(outDir, format, batchName, mode, false);
    await buildBatch(outDir, format, batchName, mode, true);

    await fs.appendFile(`${outDir}/index.js`, utils.indexFileContent(format, batchName), 'utf-8');
    await fs.appendFile(`${outDir}/index.d.ts`, utils.indexFileContent('esm', batchName), 'utf-8');
}

function buildSwitchCase(mode) {
    switch (mode) {
        case 'chains':
            const chainsIds = chains.CHAINS.map((chain) => chain.id);
            return utils.generateSwitchCase(chainsIds, 'Chain');
        case 'symbols':
            const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
            return utils.generateSwitchCase(symbols, 'Symbol');
        case 'api-providers':
            const apiProviders = apiIntegrations.getApiProviderAliases();
            return utils.generateSwitchCase(apiProviders, 'ApiProvider');
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

async function buildBatch(outDir, format = 'esm', batchName, mode, isSvg) {
    const types = utils.generateTypes(batchName, mode, isSvg);
    await fs.writeFile(`${outDir}/${batchName}${isSvg ? 'Svg' : ''}.d.ts`, types, 'utf-8');

    const imports = isSvg ? `import * as React from "react";\nimport { renderToString } from 'react-dom/server'` :
        `import * as React from "react"; \nimport camelcase from 'camelcase';
        ${buildLogoImports(mode, '', format)}`;

    let code = await babelTransform(format, imports, batchName, mode, isSvg);

    if (format === 'cjs') {
        code = code
            .replace('import * as React from "react";', 'const React = require("react");')
            .replace(`import camelcase from 'camelcase'`, `const camelcase = require('camelcase')`)
            .replace(
                `import { renderToString } from 'react-dom/server';`,
                `const { renderToString } = require('react-dom/server');`
            )
            .replace('export default', 'module.exports =');
    }

    await fs.writeFile(`${outDir}/${batchName}${isSvg ? 'Svg' : ''}.js`, code, 'utf-8');
}

async function babelTransform(format, imports, batchName, mode, isSvg) {
    let { code } = await babel.transformAsync(
        `
        ${imports}
        ${isSvg ? utils.generateSvgFunction(batchName) : utils.generateFunction(batchName, buildSwitchCase(mode), mode)}`,
        {
            presets: [['@babel/preset-react', { useBuiltIns: true }]]
        }
    );

    if (format === 'cjs') {
        code = code
            .replace('export default', 'module.exports =');
    }

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
