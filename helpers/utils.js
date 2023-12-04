const fs = require('fs/promises');
const svgr = require('@svgr/core').default;
const camelcase = require('camelcase');
const babel = require('@babel/core');

module.exports = {
    transformSVGtoJSX,
    buildChainLogos,
    buildLogos,
    sanitizeName,
    generateSwitchCase,
    generateImports,
    indexFileContent,
    generateFunction,
    generateTypes
};

function getPlaceholder(mode) {
    switch (mode) {
        case 'chains':
            return `<ChainPlaceholderLogo {...props} />;\n`;
        case 'symbols':
            return `<SymbolPlaceholderLogo {...props} />;\n`;
        case 'api-providers':
            return `<ApiProviderPlaceholderLogo {...props} />;\n`;
        default:
            break;
    }
}

function sanitizeName(name, suffix = '', prefix = '') {
    const componentName = `${camelcase(name.replace(/.svg/, ''), {
        pascalCase: true
    })}`;
    return prefix + componentName + suffix;
}

function generateSwitchCase(array, prefix) {
    return array
        .map(
            (item) => `case "${sanitizeName(item)}":\n\treturn <${prefix}${sanitizeName(item, 'Logo')} {...props} />;\n`
        )
        .join('');
}

function formatImport(item, prefix, file_prefix, file_postfix, path, format) {
    const importName = sanitizeName(item, 'Logo', prefix) + file_postfix;
    const filePath = `./logos/${path}/${sanitizeName(item, 'Logo', file_prefix)}${file_postfix}`;

    if (format === 'cjs') {
        return `const ${importName} = require('${filePath}');\n`;
    }

    return `import ${importName} from '${filePath}';\n`;
}

function generateImports(array, prefix, file_prefix, file_postfix, path, format) {
    return array.map((item) => formatImport(item, prefix, file_prefix, file_postfix, path, format)).join('');
}

function generateFunction(batchName, switchCase, mode) {
    return `
        function sanitizeName(id) {
            return camelcase(id, {
            pascalCase: true
            });
        }

        function ${batchName}(props) {
            if (!props.id) {
                return ${getPlaceholder(mode)}
            }

            switch (sanitizeName(props.id)) {
                ${switchCase}
                default:
                    return ${getPlaceholder(mode)}
            }
        }

        function ${batchName}Svg(id) {
            return "data:image/svg+xml; base64," + btoa(renderToString(${batchName}({ id: id })));
        }

        export {${batchName}, ${batchName}Svg}
        `;
}

function generateDocAnnotation(description, batchName, example) {
    return `
/**
 *
 * @param {React.SVGProps<SVGSVGElement>} props
 * @param {string} [props.id] - Unique ID for the logo element.
 * @param {string} [props.width] - Width of the logo.
 * @param {string} [props.height] - Height of the logo.
 * @returns
 * ${description}
 *
 * @example
 * \`\`\`
 * import { ${batchName} } from 'beta-logos';
 * 
 * const App = () => {
 *  return <${batchName}  id="${example}" />;
 * }
 * \`\`\`
 * 
 * @example
 * \`\`\`
* import { ${batchName} } from 'beta-logos';
 * 
 * const App = () => {
 * return <${batchName}  id="${example}" width="64" height="64" />;
 * }
 * \`\`\`
 * 
 */`;
}

function generateDocAnnotationSvg(description, batchName, example) {
    return `
/**
 *
 * @param {string} id - Unique ID for the logo element.
 * @returns
 * ${description}
 * 
 * @example
 * \`\`\`
 * import { ${batchName}Svg } from 'beta-logos';
 * 
 * const App = () => {
 * return <img src={${batchName}Svg("${example}")} alt="Logo" />;
 * }
 * \`\`\`
 * 
 * @example
 * \`\`\`
 * import { ${batchName}Svg } from 'beta-logos';
 * 
 * const App = () => {
 * return <img src={${batchName}Svg("${example}")} alt="Logo" width="64" height="64" />;
 * }
 * \`\`\`
 * 
 */`;
}

function generateTypes(batchName, mode) {
    const example = mode === 'chains' ? '1' : mode === 'api-providers' ? 'nodary' : 'eth';

    return `import * as React from 'react';
${generateDocAnnotation(`${batchName} component`, batchName, example)}
declare function ${batchName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;
${generateDocAnnotationSvg(`${batchName} component as SVG string`, batchName, example)}
declare function ${batchName}Svg(id: string): string;
export {${batchName}, ${batchName}Svg};
`;
}

async function transformSVGtoJSX(file, componentName, format, dir, isTestnet = false) {
    const content = await fs.readFile(`${dir}/${file}`, 'utf-8');
    const svgReactContent = await svgr(
        content,
        {
            icon: false,
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

async function buildChainLogos(chainId, testnet, files, logosDir, format = 'esm', dir) {
    const file = files.find((file) => file.includes(`Chain${chainId}.svg`));
    let fileName = file;

    if (!fileName) {
        throw new Error(`- Chain ${chainId} not found`);
    }

    const componentName = sanitizeName(fileName, 'Logo');
    const content = await transformSVGtoJSX(fileName, componentName, format, dir, testnet);
    await write2Files(content, logosDir, componentName);
}

async function buildLogos(symbol, testnet, files, logosDir, format = 'esm', dir, prefix = '') {
    const file = checkFile(files, symbol, prefix);
    const componentName = sanitizeName(file, 'Logo');
    const content = await transformSVGtoJSX(file, componentName, format, dir, testnet);
    await write2Files(content, logosDir, componentName);
}

function checkFile(files, item, prefix = '') {
    const file = files.find((file) => file == `${sanitizeName(item, '', prefix)}.svg`);
    let fileName = file;

    if (!fileName) {
        console.log(`- ${file}, ${sanitizeName(item)} not found`);
        throw new Error(`- ${(item, file)} not found`);
    }

    return fileName;
}

async function write2Files(content, logosDir, componentName) {
    const types = `import * as React from 'react';\ndeclare function ${componentName}(props: React.SVGProps<SVGSVGElement>): JSX.Element;\nexport default ${componentName};\n`;

    await fs.writeFile(`${logosDir}/${sanitizeName(componentName)}.js`, content, 'utf-8');
    await fs.writeFile(`${logosDir}/${sanitizeName(componentName)}.d.ts`, types, 'utf-8');
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export * from './${batchName}';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\n`;
}
