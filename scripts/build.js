const chains = require('@api3/chains');
const fs = require('fs/promises');
const rimraf = require('rimraf');
const babel = require('@babel/core');
const utils = require('../helpers/utils');
const { rename } = require('fs');
const apiIntegrations = require('@api3/api-integrations');
const { nodaryFeeds } = require('@nodary/utilities');

const outputPath = './dist';

console.log('🏗 Building logo package...');

function getManualLogos(mode) {
    switch (mode) {
        case 'chains':
            return [];
        case 'symbols':
            return ['BABA', 'ETHx', 'MATICx', 'PYTH', 'WOO', 'PYPL'];
        case 'api-providers':
            return [];
        default:
            break;
    }
}

function getLogoList(mode) {
    switch (mode) {
        case 'chains':
            return chains.CHAINS.map((chain) => chain.id);
        case 'symbols':
            return [...getManualLogos(mode), ...new Set(nodaryFeeds.map((feed) => feed.name.split('/')).flat())];
        case 'api-providers':
            return apiIntegrations.getApiProviderAliases();
        default:
            break;
    }
}

async function buildChainLogos(files, logosDir, format = 'esm', dir) {
    chains.CHAINS.forEach(async (chain) => {
        utils.buildLogos(chain.id, chain.testnet, files, logosDir, format, dir, 'Chain');
    });
    utils.buildLogos('Placeholder', false, files, logosDir, format, dir, 'Chain');
}

async function buildSymbolLogos(files, logosDir, format = 'esm', dir, mode) {
    getLogoList(mode).forEach(async (symbol) => {
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
            await buildSymbolLogos(files, logosDir, format, dir, mode);
            break;
        case 'api-providers':
            await buildSymbolLogos(files, logosDir, format, dir, mode);
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
            return utils.generateSwitchCase(getLogoList(mode), 'Chain');
        case 'symbols':
            return utils.generateSwitchCase(getLogoList(mode), 'Symbol');
        case 'api-providers':
            return utils.generateSwitchCase(getLogoList(mode), 'ApiProvider');
        default:
            break;
    }
}

function buildLogoImports(mode, postfix, format) {
    let options = getLogoList(mode);
    options.push('placeholder');
    switch (mode) {
        case 'chains':
            return utils.generateImports(options, 'Chain', 'Chain', postfix, 'chains', format);
        case 'symbols':
            return utils.generateImports(options, 'Symbol', '', postfix, 'symbols', format);
        case 'api-providers':
            return utils.generateImports(options, 'ApiProvider', '', postfix, 'api-providers', format);
        default:
            break;
    }
}

async function buildBatch(outDir, format = 'esm', batchName, mode, isSvg) {
    const types = utils.generateTypes(batchName, mode, isSvg);
    await fs.writeFile(`${outDir}/${batchName}${isSvg ? 'Svg' : ''}.d.ts`, types, 'utf-8');

    const imports = isSvg
        ? `import * as React from "react";\nimport { renderToString } from 'react-dom/server'`
        : `import * as React from "react"; \nimport camelcase from 'camelcase';
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
        ${isSvg
            ? utils.generateSvgFunction(batchName, format)
            : utils.generateFunction(batchName, buildSwitchCase(mode), mode)
        }`,
        {
            presets: [['@babel/preset-react', { useBuiltIns: true }]]
        }
    );

    if (format === 'cjs') {
        code = code.replace('export default', 'module.exports =');
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
