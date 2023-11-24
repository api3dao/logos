const chains = require('@api3/chains');
const feeds = require('../data/feeds.json');
const fs = require('fs/promises');
const rimraf = require('rimraf');
const svgr = require('@svgr/core').default;
const camelcase = require('camelcase');
const babel = require('@babel/core');

const outputPath = './dist';

async function transformSVGtoJSX(file, componentName, format, dir) {
    const content = await fs.readFile(`${dir}/${file}`, 'utf-8');
    const svgReactContent = await svgr(
        content,
        {
            icon: false,
            replaceAttrValues: { '#00497A': "{props.color || '#00497A'}" },
            svgProps: {
                width: 32,
                height: 32
            }
        },
        { componentName }
    );

    let { code } = await babel.transformAsync(svgReactContent, {
        presets: [['@babel/preset-react', { useBuiltIns: true }]]
    });

    if (format === 'esm') {
        return code;
    }

    const replaceESM = code
        .replace('import * as React from "react";', 'const React = require("react");')
        .replace('export default', 'module.exports =');
    return replaceESM;
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export { default as ${batchName} } from './${batchName}';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\n`;
}

async function buildChainIcons(files, iconsDir, format = 'esm', dir) {
    chains.CHAINS.forEach(async (chain) => {
        const file = files.find((file) => file.includes(`Chain${chain.id}.svg`));
        let fileName = file;

        if (!fileName) {
            throw new Error(`- Chain ${chain.id} not found`);
        }

        const componentName = `${camelcase(fileName.replace(/.svg/, ''), {
            pascalCase: true
        })}Icon`;

        const content = await transformSVGtoJSX(fileName, componentName, format, dir);
        const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

        // console.log(`- Creating file: ${componentName}.js`);
        await fs.writeFile(`${iconsDir}/${componentName}.js`, content, 'utf-8');
        await fs.writeFile(`${iconsDir}/${componentName}.d.ts`, types, 'utf-8');
    });
}

async function buildSymbolIcons(files, iconsDir, format = 'esm', dir) {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];

    symbols.forEach(async (symbol) => {
        const file = files.find((file) => file == `${symbol.toLowerCase().replaceAll(' ', '-')}.svg`);
        let fileName = file;

        if (!fileName) {
            throw new Error(`- Symbol ${symbol} not found`);
        }

        const componentName = sanitizeName(fileName);

        const content = await transformSVGtoJSX(fileName, componentName, format, dir);
        const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

        await fs.writeFile(`${iconsDir}/${componentName}.js`, content, 'utf-8');
        await fs.writeFile(`${iconsDir}/${componentName}.d.ts`, types, 'utf-8');
    });
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
        default:
            break;
    }

    await buildBatch(outDir, format, batchName, mode);
    await buildIndexFiles(outDir, [], format, batchName);
}

async function buildIndexFiles(outDir, files, format = 'esm', batchName) {
    console.log('- Creating file: index.js');
    await fs.appendFile(`${outDir}/index.js`, indexFileContent(format, batchName), 'utf-8');
    await fs.appendFile(`${outDir}/index.d.ts`, indexFileContent('esm', batchName), 'utf-8');
}

function sanitizeName(name) {
    const componentName = `${camelcase(name.replace(/.svg/, ''))}`;
    return componentName.toLowerCase() + 'Icon';
}

function generateSymbolSwitchCase() {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
    return symbols
        .map(
            (symbol) =>
                `
        case "${symbol.toLowerCase().replaceAll(' ', '_')}":\n\treturn <Symbol${sanitizeName(symbol)} {...props} />;\n`
        )
        .join('');
}

function generateSymbolImports() {
    const symbols = [...new Set(feeds.map((feed) => feed.name.split('/')).flat())];
    return symbols
        .map((symbol) => `import Symbol${sanitizeName(symbol)} from './icons/symbols/${sanitizeName(symbol)}';\n`)
        .join('');
}

function buildSwitchCase(mode) {
    switch (mode) {
        case 'chains':
            return chains.CHAINS.map(
                (chain) => `case "${chain.id}":\n\treturn <Chain${chain.id}Icon {...props} />;\n`
            ).join('');
        case 'symbols':
            return generateSymbolSwitchCase();
        default:
            break;
    }
}

function buildIconImports(mode) {
    switch (mode) {
        case 'chains':
            return chains.CHAINS.map(
                (chain) => `import Chain${chain.id}Icon from './icons/chains/Chain${chain.id}Icon';\n`
            ).join('');
        case 'symbols':
            return generateSymbolImports();
        default:
            break;
    }
}

async function buildBatch(outDir, format = 'esm', batchName, mode) {
    const types = `import * as React from 'react';\ndeclare function ${batchName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${batchName};\n`;
    await fs.writeFile(`${outDir}/${batchName}.d.ts`, types, 'utf-8');

    const imports = `import * as React from "react";
        ${buildIconImports(mode)};\n\n`;

    let { code } = await babel.transformAsync(
        `
        ${imports}
        
        function ${batchName}(props) {
            switch (props.id.toLowerCase().replaceAll(" ", "_")) {
                ${buildSwitchCase(mode)}
                default:
                    return null;
            }
        }
        export default ${batchName};
    `,
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
}

(function main() {
    console.log('🏗 Building icon package...');
    new Promise((resolve) => {
        rimraf(`${outputPath}/*`, resolve);
    })
        .then(() => Promise.all([generateIcons('cjs'), generateIcons('esm')]))
        .then(() => console.log('✅ Finished building package.'));
})();
