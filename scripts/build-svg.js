const fs = require('fs/promises');
const { rimraf } = require('rimraf');
const babel = require('@babel/core');
const utils = require('../helpers/utils');

const outputPath = './dist';

const categories = ['chain', 'symbol', 'api-provider'];

let chainLightLogos = [];
let apiProviderLightLogos = [];
let symbolLightLogos = [];

function getLogoList(mode) {
    switch (mode) {
        case 'chain':
            return [...chainLightLogos, ...utils.getManualLogos(mode), ...utils.getSupportedChains()];
        case 'symbol':
            return [...symbolLightLogos, ...utils.getManualLogos(mode), ...utils.getSupportedFeeds()];
        case 'api-provider':
            return [...apiProviderLightLogos, ...utils.getManualLogos(mode), ...utils.getApiProviders()];
        default:
            return [];
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
    await fs.appendFile(`${outDir}/${batchName}Extended.json`, JSON.stringify(utils.getManualLogos(mode)), 'utf-8');
}

function buildSwitchCase(files, mode) {
    return utils.generateSwitchCase(files, getLogoList(mode), utils.toPascalCase(mode));
}

function buildLogoImports(files, mode, format) {
    let options = getLogoList(mode);
    options.push('placeholder');
    const prefix = mode === 'chain' ? 'Chain' : '';
    return utils.generateImports(files, options, utils.toPascalCase(mode), prefix, mode, format);
}

function getMissingLogos(files, mode) {
    const logos = getLogoList(mode);
    const prefix = mode === 'chain' ? 'Chain' : '';
    const missingLogos = logos.filter(
        (logo) =>
            !files.find((file) => file.toLowerCase() === `${utils.sanitizeName(logo, '', prefix).toLowerCase()}.svg`)
    );
    console.log(`Missing ${mode} logos: ${missingLogos}`);
    return missingLogos;
}

async function buildBatch(files, outDir, format = 'esm', batchName, mode) {
    const types = utils.generateTypes(batchName, mode);
    await fs.writeFile(`${outDir}/${batchName}.d.ts`, types, 'utf-8');

    const imports = buildLogoImports(files, mode, format);

    let code = await babelTransform(files, format, imports, batchName, mode);

    if (format === 'cjs') {
        code = code.replace('export default', 'module.exports =');
    }

    await fs.writeFile(`${outDir}/${batchName}.js`, code, 'utf-8');
}

async function babelTransform(files, format, imports, batchName, mode) {
    let { code } = await babel.transformAsync(
        `
        ${imports}
        ${utils.generateFunction(batchName, buildSwitchCase(files, mode), mode)}`,
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

async function findLightLogos() {
    const [chainFiles, apiProviderFiles, symbolFiles] = await Promise.all([
        fs.readdir('./optimized/chain', 'utf-8'),
        fs.readdir('./optimized/api-provider', 'utf-8'),
        fs.readdir('./optimized/symbol', 'utf-8')
    ]);

    chainLightLogos = chainFiles.filter((file) => file.includes('light')).map((file) => file.replace('Chain', ''));

    apiProviderLightLogos = apiProviderFiles.filter((file) => file.includes('light'));

    symbolLightLogos = symbolFiles.filter((file) => file.includes('light'));
}

async function main() {
    console.log('🏗 Building logo package...');
    rimraf(`${outputPath}/`)
        .then(findLightLogos)
        .then(renameFiles)
        .then(() => Promise.all([generateLogos('cjs'), generateLogos('esm')]))
        .then(() => console.log('✅ Finished building package.'));
}

main();
