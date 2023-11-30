const fs = require('fs/promises');
const svgr = require('@svgr/core').default;
const camelcase = require('camelcase');
const babel = require('@babel/core');

module.exports = {
    transformSVGtoJSX,
    buildChainIcons,
    buildSymbolIcons,
    sanitizeName,
    generateSwitchCase,
    generateImports,
    indexFileContent,
    generateFunction
};

function getPlaceholder(mode) {
    switch (mode) {
        case 'chains':
            return `<ChainplaceholderIcon {...props} />;\n`;
        case 'symbols':
            return `<SymbolplaceholderIcon {...props} />;\n`;
        case 'api-providers':
            return `<ApiProviderplaceholderIcon {...props} />;\n`;
        default:
            break;
    }
}

function sanitizeName(name) {
    const componentName = `${camelcase(name.replace(/.svg/, ''))}`;
    return componentName.toLowerCase() + 'Icon';
}

function generateSwitchCase(array, prefix) {
    return array
        .map(
            (item) =>
                `case "${item.toLowerCase().replaceAll(' ', '_')}":\n\treturn <${prefix}${sanitizeName(
                    item
                )} {...props} />;\n`
        )
        .join('');
}

function generateImports(array, prefix, file_prefix, path) {
    return array
        .map(
            (item) =>
                `import ${prefix}${sanitizeName(item)} from './icons/${path}/${file_prefix}${sanitizeName(item)}';\n`
        )
        .join('');
}

function generateFunction(batchName, switchCase, mode) {
    return `
            function ${batchName}(props) {
            if (!props.id) {
                return ${getPlaceholder(mode)};
            }
            switch (props.id.toLowerCase().replaceAll(" ", "_")) {
                ${switchCase}
                default:
                    return ${getPlaceholder(mode)}
            }
        }
        export default ${batchName};
        `;
}

async function transformSVGtoJSX(file, componentName, format, dir, isTestnet = false) {
    const content = await fs.readFile(`${dir}/${file}`, 'utf-8');
    const svgReactContent = await svgr(
        content,
        {
            icon: false,
            replaceAttrValues: { '#00497A': "{props.color || '#00497A'}" },
            svgProps: {
                width: 32,
                height: 32,
                filter: isTestnet ? 'grayscale(1)' : 'none'
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

async function buildChainIcons(chainId, testnet, files, iconsDir, format = 'esm', dir) {
    const file = files.find((file) => file.includes(`Chain${chainId}.svg`));
    let fileName = file;

    if (!fileName) {
        throw new Error(`- Chain ${chainId} not found`);
    }

    const componentName = `${camelcase(fileName.replace(/.svg/, ''), {
        pascalCase: true
    })}Icon`;

    const content = await transformSVGtoJSX(fileName, componentName, format, dir, testnet);

    await write2Files(content, iconsDir, componentName);
}

async function buildSymbolIcons(symbol, files, iconsDir, format = 'esm', dir) {
    const file = checkFile(files, symbol);
    const componentName = sanitizeName(file);
    const content = await transformSVGtoJSX(file, componentName, format, dir);
    await write2Files(content, iconsDir, componentName);
}

function checkFile(files, item) {
    const file = files.find((file) => file == `${item.toLowerCase().replaceAll(' ', '-')}.svg`);
    let fileName = file;

    if (!fileName) {
        throw new Error(`- ${item} not found`);
    }

    return fileName;
}

async function write2Files(content, iconsDir, componentName) {
    const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

    await fs.writeFile(`${iconsDir}/${componentName}.js`, content, 'utf-8');
    await fs.writeFile(`${iconsDir}/${componentName}.d.ts`, types, 'utf-8');
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export { default as ${batchName} } from './${batchName}';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\n`;
}
