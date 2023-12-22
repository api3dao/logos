const chains = require('@api3/chains');
const fs = require('fs/promises');
const { rimraf } = require('rimraf')
const babel = require('@babel/core');
const utils = require('../helpers/utils');
const apiIntegrations = require('@api3/api-integrations');
const { nodaryFeeds } = require('@nodary/utilities');
const camelcase = require('camelcase');

const outputPath = './dist';

const categories = ['chain', 'symbol', 'api-provider'];

function getManualLogos(mode) {
    switch (mode) {
        case 'chain':
            return [];
        case 'symbol':
            return [];
        case 'api-provider':
            return [];
        default:
            break;
    }
}

function getLogoList(mode) {
    switch (mode) {
        case 'chain':
            return [...getManualLogos(mode), ...chains.CHAINS.map((chain) => chain.id)];
        case 'symbol':
            return [...getManualLogos(mode), ...new Set(nodaryFeeds.map((feed) => feed.name.split('/')).flat())];
        case 'api-provider':
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
    await fs.appendFile(`${outDir}/${batchName}Missing.json`, JSON.stringify(getMissingLogos(files, mode)), 'utf-8');
}

function buildSwitchCase(mode) {
    return utils.generateSwitchCase(getLogoList(mode), camelcase(mode, { pascalCase: true }));
}

function buildLogoImports(files, mode, format) {
    let options = getLogoList(mode);
    options.push('error');
    const prefix = mode === 'chain' ? 'Chain' : '';
    return utils.generateImports(files, options, camelcase(mode, { pascalCase: true }), prefix, mode, format);
}

function getMissingLogos(files, mode) {
    const logos = getLogoList(mode);
    const prefix = mode === 'chain' ? 'Chain' : '';
    return logos.filter(
        (logo) =>
            !files.find((file) => file.toLowerCase() === `${utils.sanitizeName(logo, '', prefix).toLowerCase()}.svg`)
    );
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

async function generateLogos(format = 'esm') {
    categories.forEach(async (category) => {
        await buildLogos(format, `./optimized/${category}`, category, utils.sanitizeName(category, 'Logo'));
    });
}

async function renameFiles() {
    categories.forEach(async (category) => {
        await utils.renameFiles(`./optimized/${category}`);
    });
}

async function main() {
    console.log('🏗 Building logo package...');
    rimraf(`${outputPath}/`)
        .then(() => Promise.all([renameFiles()]))
        .then(() => Promise.all([generateLogos('cjs'), generateLogos('esm')]))
        .then(() => console.log('✅ Finished building package.'));
};

main();
