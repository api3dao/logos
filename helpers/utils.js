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

function getPlaceholder(mode, isBase64 = false) {
    switch (mode) {
        case 'chains':
            return isBase64 ? 'ChainPlaceholderIconBase64' : `<ChainPlaceholderIcon {...props} />;\n`;
        case 'symbols':
            return isBase64 ? 'SymbolPlaceholderIconBase64' : `<SymbolPlaceholderIcon {...props} />;\n`;
        case 'api-providers':
            return isBase64 ? 'ApiProviderPlaceholderIconBase64' : `<ApiProviderPlaceholderIcon {...props} />;\n`;
        default:
            break;
    }
}

function sanitizeName(name, suffix = '') {
    const componentName = `${camelcase(name.replace(/.svg/, ''), {
        pascalCase: true
    })}`;
    return componentName + suffix;
}

function generateSwitchCase(array, prefix, isBase64 = false) {
    return array
        .map(
            (item) =>
                isBase64 ?
                    `case "${sanitizeName(item)}":\n\treturn ${prefix}${sanitizeName(
                        item, 'IconBase64()'
                    )};\n` :
                    `case "${sanitizeName(item)}":\n\treturn <${prefix}${sanitizeName(
                        item, 'Icon'
                    )} {...props} />;\n`
        )
        .join('');
}

function generateImports(array, prefix, file_prefix, file_postfix, path) {
    return array
        .map(
            (item) =>
                `import ${prefix}${sanitizeName(item, 'Icon')}${file_postfix} from './icons/${path}/${file_prefix}${sanitizeName(item, 'Icon')}${file_postfix}';\n`
        )
        .join('');
}

function generateFunction(batchName, switchCase, mode, isBase64) {
    return `
            function ${batchName}(${isBase64 ? 'id' : 'props'}) {
            if (${isBase64 ? '!id' : '!props.id'}) {
                return ${getPlaceholder(mode, isBase64)}
            }

            function sanitizeName(id) {
                return camelcase(id, {
                    pascalCase: true
                });
            }

            switch (${isBase64 ? 'sanitizeName(id)' : 'sanitizeName(props.id)'}) {
                ${switchCase}
                default:
                    return ${getPlaceholder(mode, isBase64)}
            }
        }
        export default ${batchName};
        `;
}
async function transformSVGtoBase64(file, fileName, format, dir) {
    const content = await fs.readFile(`${dir}/${file}`, 'base64');
    const fx = `function ${fileName}Base64() {return "data:image/svg+xml;base64,${content}"}export default ${fileName}Base64;`;
    let { code } = await babel.transformAsync(fx, {
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

    const componentName = sanitizeName(fileName, 'Icon');

    const content = await transformSVGtoJSX(fileName, componentName, format, dir, testnet);
    await write2Files(content, iconsDir, componentName);

    const svgContent = await transformSVGtoBase64(file, componentName, format, dir);
    await write2Files(svgContent, iconsDir, componentName + 'Base64', true);
}

async function buildSymbolIcons(symbol, files, iconsDir, format = 'esm', dir) {
    const file = checkFile(files, symbol);
    const componentName = sanitizeName(file, 'Icon');
    const content = await transformSVGtoJSX(file, componentName, format, dir);
    await write2Files(content, iconsDir, componentName);

    const svgContent = await transformSVGtoBase64(file, componentName, format, dir);
    await write2Files(svgContent, iconsDir, componentName + 'Base64', true);
}

function checkFile(files, item) {
    const file = files.find((file) => file == `${sanitizeName(item)}.svg`);
    let fileName = file;

    if (!fileName) {
        console.log(`- ${file}, ${sanitizeName(item)} not found`);
        throw new Error(`- ${item, file} not found`);
    }

    return fileName;
}

async function write2Files(content, iconsDir, componentName, isBase64 = false) {
    const types = isBase64
        ? `declare function ${componentName}(): string;\nexport default ${componentName};\n`
        : `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

    await fs.writeFile(`${iconsDir}/${sanitizeName(componentName)}.js`, content, 'utf-8');
    await fs.writeFile(`${iconsDir}/${sanitizeName(componentName)}.d.ts`, types, 'utf-8');
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export { default as ${batchName} } from './${batchName}';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\n`;
}
