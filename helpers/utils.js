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
    renameFiles,
    getManualLogos,
    getDeprecatedChains
};

function getDeprecatedChains() {
    return ['1313161555', '1313161554', '56288', '288', '71401', '647', '416'];
}

function getManualLogos(mode) {
    switch (mode) {
        case 'chain':
            return ['25', '534352'];
        case 'symbol':
            return [
                'alpaca',
                'amd',
                'amp',
                'apxeth',
                'bch',
                'benqi',
                'bit',
                'blockstack',
                'brz',
                'bsv',
                'busd',
                'chain',
                'dash',
                'dfi',
                'dkk',
                'eb',
                'ecash',
                'elrond',
                'eos',
                'etc',
                'ezeth',
                'flux',
                'ftx',
                'gate',
                'gmt',
                'hkd',
                'icon',
                'icx',
                'iost',
                'iotx',
                'jst',
                'klay',
                'knc',
                'leo',
                'lpt',
                'lrc',
                'luna',
                'mim',
                'mimatic',
                'miota',
                'neo',
                'neutr',
                'nexo',
                'nke',
                'nok',
                'omg',
                'one',
                'ooki',
                'pax',
                'pltr',
                'pufeth',
                'pyusd',
                'qcom',
                'qi',
                'qnt',
                'rbtc',
                'rus',
                'rvn',
                'srm',
                'stock',
                'susd',
                'tfuel',
                'theta',
                'twt',
                'uber',
                'usa',
                'usdd',
                'vet',
                'waves',
                'wld',
                'xaut',
                'xec',
                'xvs',
                'zc',
                'zcash',
                'zkevm',
                'zs'
            ];
        case 'api-provider':
            return [];
        default:
            break;
    }
}

function getPlaceholderImage(mode) {
    return camelcase(mode, { pascalCase: true }) + 'Placeholder';
}

function sanitizeName(name, suffix = '', prefix = '') {
    const componentName = `${camelcase(name.replace(/.svg/, ''), {
        pascalCase: true
    })}`;
    return prefix + componentName + suffix;
}

function generateSwitchCase(array, prefix) {
    const sanitized = array.map((item) => {
        return sanitizeName(item, '', '');
    });

    const filtered = [...new Set(sanitized)];
    return filtered
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
    const sanitized = array.map((item) => {
        return sanitizeName(item, '', '');
    });

    const filtered = [...new Set(sanitized)];

    return filtered
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
            }).replace(/ExchangeRate/g, '');
        }

        function ${batchName}(id, light = false) {
            if (!id) {
                return ${getPlaceholderImage(mode)}
            }

            switch (sanitizeName(\`\${id}\${light ? "light" : ""}\`).toLowerCase()) {
                ${switchCase}
                default:
                    return light ? ${batchName}(id) : ${getPlaceholderImage(mode)}
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
 * @param {boolean} [light=false] - Light version.
 * @returns
 * ${description}
 * 
 * @example
 * \`\`\`
 * import { ${batchName}Svg } from '@api3/logos';
 * 
 * const App = () => {
 * return <img src={${batchName}Svg("${example}")} alt="Logo" />;
 * }
 * \`\`\`
 * 
 * @example
 * \`\`\`
 * import { ${batchName}Svg } from '@api3/logos';
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
declare function ${batchName}(id: string, light?: boolean): string;
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
