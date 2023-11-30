const chains = require('@api3/chains');
const feeds = require('../data/feeds.json');
const fs = require('fs/promises');
const rimraf = require('rimraf');
const babel = require('@babel/core');
const utils = require('../helpers/utils');

const outputPath = './dist';

const apiProviders = [
    'coinpaprika',
    'demo',
    'dxfeed',
    'finage',
    'finnhub',
    'iexcloud',
    'kaiko',
    'ncfx',
    'nodary',
    'tradermade',
    'twelvedata'
];

async function buildChainIcons(files, iconsDir, format = 'esm', dir) {
    chains.CHAINS.forEach(async (chain) => {
        utils.buildChainIcons(chain.id, chain.testnet, files, iconsDir, format, dir);
    });
    utils.buildChainIcons('placeholder', false, files, iconsDir, format, dir);
}

async function buildApiProviderLogos(files, iconsDir, format = 'esm', dir) {
    apiProviders.forEach(async (provider) => {
        utils.buildSymbolIcons(provider, files, iconsDir, format, dir);
    });
    utils.buildSymbolIcons('placeholder', files, iconsDir, format, dir);
}

async function buildSymbolIcons(files, iconsDir, format = 'esm', dir) {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];

    symbols.forEach(async (symbol) => {
        utils.buildSymbolIcons(symbol, files, iconsDir, format, dir);
    });
    utils.buildSymbolIcons('placeholder', files, iconsDir, format, dir);
}

async function buildIcons(format = 'esm', dir, mode, batchName) {
    let outDir = `${outputPath}/${format}`;
    let iconsDir = `${outDir}/icons/${mode || ''}`;

    await fs.mkdir(outDir, { recursive: true });
    await fs.mkdir(iconsDir, { recursive: true });

    const files = await fs.readdir(dir, 'utf-8');

    switch (mode) {
        case 'chains':
            await buildChainIcons(files, iconsDir, format, dir);
            break;
        case 'symbols':
            await buildSymbolIcons(files, iconsDir, format, dir);
            break;
        case 'api-providers':
            await buildApiProviderLogos(files, iconsDir, format, dir);
            break;
        default:
            break;
    }

    await buildBatch(outDir, format, batchName, mode);

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
            return utils.generateSwitchCase(apiProviders, 'ApiProvider');
        default:
            break;
    }
}

function buildIconImports(mode) {
    switch (mode) {
        case 'chains':
            let chainIds = chains.CHAINS.map((chain) => chain.id);
            chainIds.push('placeholder');
            return utils.generateImports(chainIds, 'Chain', 'Chain', 'chains');
        case 'symbols':
            let symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
            symbols.push('placeholder');
            return utils.generateImports(symbols, 'Symbol', '', 'symbols');
        case 'api-providers':
            let providers = apiProviders.map((provider) => provider);
            providers.push('placeholder');
            return utils.generateImports(providers, 'ApiProvider', '', 'api-providers');
        default:
            break;
    }
}

async function buildBatch(outDir, format = 'esm', batchName, mode) {
    const types = `import * as React from 'react';\ndeclare function ${batchName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${batchName};\n`;
    await fs.writeFile(`${outDir}/${batchName}.d.ts`, types, 'utf-8');

    const imports = `import * as React from "react";
        ${buildIconImports(mode)}`;

    let { code } = await babel.transformAsync(
        `
        ${imports}
        ${utils.generateFunction(batchName, buildSwitchCase(mode), mode)}`,
        {
            presets: [['@babel/preset-react', { useBuiltIns: true }]]
        }
    );

    if (format === 'cjs') {
        code = code
            .replace('import * as React from "react";', 'const React = require("react");')
            .replace('export default', 'module.exports =');
    }

    await fs.writeFile(`${outDir}/${batchName}.js`, code, 'utf-8');
}

async function generateIcons(format = 'esm') {
    await buildIcons(format, './optimized/chains', 'chains', 'ChainIcon');
    await buildIcons(format, './optimized/symbols', 'symbols', 'SymbolIcon');
    await buildIcons(format, './optimized/api-providers', 'api-providers', 'ApiProviderLogo');
}

async function exportSVGs(group) {
    await fs.mkdir(`${outputPath}/svg/${group}`, { recursive: true });

    const files = await fs.readdir(`./optimized/${group}`, 'utf-8');
    files.forEach(async (file) => {
        const content = await fs.readFile(`./optimized/${group}/${file}`, 'utf-8');
        await fs.writeFile(`${outputPath}/svg/${group}/${file}`, content, 'utf-8');
    });
}

(function main() {
    console.log('🏗 Building icon package...');
    new Promise((resolve) => {
        rimraf(`${outputPath}/*`, resolve);
    })
        .then(() => Promise.all([generateIcons('cjs'), generateIcons('esm')]))
        .then(() => Promise.all([exportSVGs('chains'), exportSVGs('symbols')]))
        .then(() => console.log('✅ Finished building package.'));
})();
