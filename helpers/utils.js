const fs = require('fs/promises');
const { rename } = require('fs');
const { getChains, dapis, api3Contracts } = require('@api3/dapi-management');

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
    getSupportedChains,
    getApiProviders,
    getSupportedFeeds,
    getDapps,
    toPascalCase
};

function getDapps() {
    return api3Contracts.DAPPS.map((dapp) => dapp.alias);
}

function getApiProviders() {
    const providers = [...new Set(dapis.map((dapi) => dapi.providers).flat())];
    const filteredApiProviders = providers.filter((api) => !api.match(/(.*)(-mock)/));
    return filteredApiProviders;
}

function getSupportedFeeds() {
    const filtered = dapis.filter((dapi) => dapi.stage !== 'retired').map((dapi) => dapi.name);
    return filtered.map((feed) => feed.replaceAll(' Exchange Rate', '').split('/')).flat();
}

function getSupportedChains() {
    return getChains()
        .filter((chain) => chain.stage !== 'retired')
        .map((chain) => chain.id);
}

function getSupportList(mode) {
    switch (mode) {
        case 'chain':
            return getSupportedChains();
        case 'symbol':
            return getSupportedFeeds();
        case 'api-provider':
            return getApiProviders();
        case 'dapp':
            return getDapps();
        default:
            return [];
    }
}

function getManualLogos(mode) {
    switch (mode) {
        case 'chain':
            return [];
        case 'symbol':
            return [];
        case 'api-provider':
            return [];
        case 'dapp':
            return [];
        default:
            return [];
    }
}

function getPlaceholderImage(mode) {
    return toPascalCase(mode) + 'Placeholder';
}

function toPascalCase(string) {
    return string
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_]+|[^\p{L}\p{N}]/gu, ' ')
        .toLowerCase()
        .replace(/(?:^|\s)(\p{L})/gu, (_, letter) => letter.toUpperCase())
        .replace(/\s+/g, '');
}

function sanitizeName(name, suffix = '', prefix = '') {
    const componentName = `${toPascalCase(name.replace(/.svg/, ''))}`;
    return prefix + componentName + suffix;
}

function generateSwitchCase(files, array, prefix) {
    const sanitized = array.map((item) => {
        return sanitizeName(item, '', '');
    });

    const file_prefix = prefix === 'Chain' ? 'Chain' : '';

    const filtered = [...new Set(sanitized)];
    return filtered
        .map((item) => {
            let filename = checkFile(files, item, file_prefix);
            if (item !== 'Placeholder' && filename === 'Placeholder.svg') return '';
            return `case "${sanitizeName(item).toLowerCase()}":\n\treturn ${prefix}${sanitizeName(item, '')};\n`;
        })
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
            if (item !== 'Placeholder' && filename === 'Placeholder.svg') return '';
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
            return id.replace(/\\s+|-/g, '').replace(/ExchangeRate/g, '');
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
    const supportList = getSupportList(prefix);
    const exceptions = ['Placeholder', 'Light'];
    files.forEach(async (file) => {
        const isSupported =
            supportList.some(
                (item) =>
                    sanitizeName(item).toLowerCase() === file.replace('.svg', '').replace('Chain', '').toLowerCase()
            ) || exceptions.some((item) => file.includes(item));
        if (!isSupported) return;
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
