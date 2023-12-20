const fs = require('fs/promises');
const camelcase = require('camelcase');

module.exports = {
    sanitizeName,
    generateSwitchCase,
    generateImports,
    indexFileContent,
    generateFunction,
    generateSvgFunction,
    generateTypes,
    copySvgFiles
};

function getErrorImage(mode) {
    switch (mode) {
        case 'chains':
            return `ChainError\n`;
        case 'symbols':
            return `SymbolError\n`;
        case 'api-providers':
            return `ApiProviderError\n`;
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
            (item) => `case "${sanitizeName(item).toLowerCase()}":\n\treturn ${prefix}${sanitizeName(item, '')};\n`
        )
        .join('');
}

function formatImport(item, filename, prefix, path, format) {
    const importName = sanitizeName(item, '', prefix);
    const filePath = `../logos/${path}/${filename}`;

    if (format === 'cjs') {
        return `const ${importName} = require('${filePath}');\n`;
    }

    return `import ${importName} from '${filePath}';\n`;
}

function generateImports(files, array, prefix, file_prefix, path, format) {
    return array.map((item) => {
        let filename = checkFile(files, item, file_prefix);
        return formatImport(item, filename, prefix, path, format)
    }).join('');
}

function generateFunction(batchName, switchCase, mode) {
    return `
        function sanitizeName(id) {
            return camelcase(id, {
            pascalCase: true
            });
        }

        function ${batchName}(id) {
            if (!id) {
                return ${getErrorImage(mode)}
            }

            switch (sanitizeName(id).toLowerCase()) {
                ${switchCase}
                default:
                    return ${getErrorImage(mode)}
            }
        }

        export default ${batchName}
        `;
}

function generateSvgFunction(batchName, format) {
    return `${format === 'esm'
        ? `import ${batchName} from './${batchName}.js';\n`
        : `const ${batchName} = require('./${batchName}.js');\n`
        }

        function ${batchName}Svg(id) {
            return "data:image/svg+xml; base64," + btoa(renderToString(${batchName}({ id: id })));
        }

        export default ${batchName}Svg
        `;
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

    return `${generateDocAnnotationSvg(`${batchName} component`, batchName, example)}
declare function ${batchName}(id: string): string;
export default ${batchName};
`;
}

async function copySvgFiles(files, logosDir, prefix = '') {
    files.forEach(async (file) => {
        await fs.copyFile(`./optimized/${prefix}/${file}`, `${logosDir}/${file}`);
    });
}

function checkFile(files, item, prefix = '') {
    return files.find(file => file.toLowerCase() === `${sanitizeName(item, '', prefix).toLowerCase()}.svg`) || 'Placeholder.svg';
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export { default as ${batchName} } from './${batchName}.js';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\n`;
}
