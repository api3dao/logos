const fs = require('fs/promises');
const camelcase = require('camelcase');
const { rename } = require('fs');

module.exports = {
    sanitizeName,
    generateSwitchCase,
    generateImports,
    indexFileContent,
    generateFunction,
    generateTypes,
    copySvgFiles,
    renameFiles
};

function getErrorImage(mode) {
    return camelcase(mode, { pascalCase: true }) + 'Error';
}

function sanitizeName(name, suffix = '', prefix = '') {
    const componentName = `${camelcase(name.replace(/.svg/, ''), {
        pascalCase: true
    })}`;
    return prefix + componentName + suffix;
}

function generateSwitchCase(array, prefix) {
    return array
        .map((item) => `case "${sanitizeName(item).toLowerCase()}":\n\treturn ${prefix}${sanitizeName(item, '')};\n`)
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
    return array
        .map((item) => {
            let filename = checkFile(files, item, file_prefix);
            return formatImport(item, filename, prefix, path, format);
        })
        .join('');
}

async function renameFiles(dir) {
    const files = await fs.readdir(dir, 'utf-8');
    files.forEach((file) => {
        rename(dir + '/' + file, dir + '/' + sanitizeName(file) + '.svg', function (err) {
            if (err) console.log('Error: ' + err);
        });
    });
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
    const example = mode === 'chain' ? '1' : mode === 'api-provider' ? 'nodary' : 'eth';

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
    return (
        files.find((file) => file.toLowerCase() === `${sanitizeName(item, '', prefix).toLowerCase()}.svg`) ||
        'Placeholder.svg'
    );
}

function indexFileContent(format, batchName) {
    return format === 'esm'
        ? `export { default as ${batchName} } from './${batchName}.js';\nexport { default as ${batchName}Missing } from './${batchName}Missing.json';\n`
        : `module.exports.${batchName} = require('./${batchName}.js');\nmodule.exports.${batchName}Missing = require('./${batchName}Missing.json');\n`;
}
