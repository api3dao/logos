require('dotenv').config();
const chains = require('@phase21/chains');
const fs = require('fs/promises');
const utils = require('../helpers/utils');
const { apisData, getApiProviderAliases } = require('@phase21/api-integrations');
const dropbox = require('dropbox');

let missingLogos = [];

const categories = ['chain', 'symbol', 'api-provider'];

const dbx = new dropbox.Dropbox({ accessToken: process.env.DROPBOX });

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
            const supportedFeed = [
                ...new Set(
                    getApiProviderAliases()
                        .map((apiProvider) => Object.values(apisData[apiProvider].supportedFeedsInBatches).flat(2))
                        .flat()
                )
            ];
            return [...getManualLogos(mode), ...new Set(supportedFeed.map((feed) => feed.split('/')).flat())];
        case 'api-provider':
            return [...getManualLogos(mode), ...getApiProviderAliases()];
        default:
            break;
    }
}

async function searchLogos() {
    console.log('🏗 Fetching logo files...');
    const foundLogos = await fetchLogos();
    console.log(
        foundLogos.map((logo) => logo.name),
        missingLogos
    );

    missingLogos.map((missingLogoCategory) => {
        missingLogoCategory.logos.map((missingLogo) => {
            foundLogos.map((foundLogo) => {
                if (foundLogo.name.toLowerCase() === `${missingLogo.toLowerCase()}.svg`) {
                    downloadLogos(missingLogoCategory.category, foundLogo.name);
                }
            });
        });
    });

    console.log('✅ Finished fetching logo files.');
}

async function fetchLogos() {
    try {
        const response = await dbx.filesListFolder({ path: '' });
        return response.result.entries;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function saveToDisk(file, category, blob) {
    fs.writeFile(`./raw/${category}s/${file}`, blob, function (err) {
        if (err) {
            console.error(err);
        }
    });
}

async function downloadLogos(category, file) {
    try {
        const response = await dbx.filesDownload({ path: `/${file}` });
        var blob = response.result.fileBinary;
        await saveToDisk(file, category, blob);
        console.log(`Downloaded ${file}`);
    } catch (error) {
        console.error(error);
    }
}

async function getMissingLogos(dir, mode) {
    const files = await fs.readdir(dir, 'utf-8');

    const logos = getLogoList(mode);
    const prefix = mode === 'chain' ? 'Chain' : '';
    const missingLogos = logos.filter(
        (logo) =>
            !files.find(
                (file) =>
                    utils.sanitizeName(file).toLowerCase() === `${utils.sanitizeName(logo, '', prefix).toLowerCase()}`
            )
    );
    console.log(`Missing ${mode} logos: ${missingLogos}`);
    return missingLogos;
}

async function checkLogos() {
    categories.forEach(async (category) => {
        const logos = await getMissingLogos(`./raw/${category}s`, category);
        missingLogos.push({
            category: category,
            logos: logos.map((logo) => utils.sanitizeName(logo).toLowerCase())
        });
    });
}

async function main() {
    console.log('🏗 Checking logo files...');
    Promise.all([checkLogos(), searchLogos()]).then(() => console.log('✅ Finished checking logo files.'));
}

main();
