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
            return [];
        case 'api-providers':
            return [];
        default:
            break;
    }
}

function getLogoList(mode) {
    switch (mode) {
        case 'chains':
            return [...getManualLogos(mode), ...chains.CHAINS.map((chain) => chain.id)];
        case 'symbols':
            return [...getManualLogos(mode), ...new Set(nodaryFeeds.map((feed) => feed.name.split('/')).flat())];
        case 'api-providers':
            return [...getManualLogos(mode), ...apiIntegrations.getApiProviderAliases()];
        default:
            break;
    }
}

async function buildLogos(format = 'esm', dir, mode, batchName) {
    let outDir = `${outputPath}/${format}`;
    let logosDir = `${outputPath}/logos/${mode || ''}`;

    await fs.mkdir(outDir, { recursive: true });
    await fs.mkdir(logosDir, { recursive: true });

    const files = await fs.readdir(dir, 'utf-8');
    utils.copySvgFiles(files, logosDir, mode);

    await buildBatch(files, outDir, format, batchName, mode);

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

function buildLogoImports(files, mode, format) {
    let options = getLogoList(mode);
    options.push('error');
    switch (mode) {
        case 'chains':
            return utils.generateImports(files, options, 'Chain', 'Chain', 'chains', format);
        case 'symbols':
            return utils.generateImports(files, options, 'Symbol', '', 'symbols', format);
        case 'api-providers':
            return utils.generateImports(files, options, 'ApiProvider', '', 'api-providers', format);
        default:
            break;
    }
}

async function buildBatch(files, outDir, format = 'esm', batchName, mode) {
    const types = utils.generateTypes(batchName, mode);
    await fs.writeFile(`${outDir}/${batchName}.d.ts`, types, 'utf-8');

    const imports = `import camelcase from 'camelcase';
        ${buildLogoImports(files, mode, format)}`;

    let code = await babelTransform(format, imports, batchName, mode);

    if (format === 'cjs') {
        code = code
            .replace(`import camelcase from 'camelcase'`, `const camelcase = require('camelcase')`)
            .replace(
                `import { renderToString } from 'react-dom/server';`,
                `const { renderToString } = require('react-dom/server');`
            )
            .replace('export default', 'module.exports =');
    }

    await fs.writeFile(`${outDir}/${batchName}.js`, code, 'utf-8');
}

async function babelTransform(format, imports, batchName, mode) {
    let { code } = await babel.transformAsync(
        `
        ${imports}
        ${utils.generateFunction(batchName, buildSwitchCase(mode), mode)}`,
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
