require('dotenv').config();
const chains = require('@phase21/chains');
const fs = require('fs/promises');
const { existsSync } = require('node:fs');
const utils = require('../helpers/utils');
const { apisData, getApiProviderAliases } = require('@phase21/api-integrations');
const dropbox = require('dropbox');
const fetch = require('node-fetch');

let missingLogos = [];

const categories = ['chain', 'symbol', 'api-provider'];

let dbx = null;

async function initDropbox() {
    console.log('🏗 Initializing Dropbox...');
    const response = await fetch(
        `https://api.dropbox.com/oauth2/token?refresh_token=${process.env.DROPBOX}&grant_type=refresh_token&client_id=${process.env.APP_KEY}&client_secret=${process.env.APP_SECRET}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    const data = await response.json();
    dbx = new dropbox.Dropbox({ accessToken: data.access_token });

    console.log('✅ Finished initializing Dropbox.');
    return dbx;
}

async function getDropbox() {
    return dbx || (await initDropbox());
}

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

async function checkAlternateLogos(foundLogos) {
    categories.forEach(async (category) => {
        const alternateLogos = getLogoList(category).reduce((acc, chain) => {
            const foundLogo = foundLogos.find((foundLogo) => foundLogo.name.toLowerCase().includes(chain.toLowerCase() + '-light'));
            if (foundLogo) {
                acc.push(foundLogo);
            }
            return acc;
        }, []);
        alternateLogos.map((foundLogo) => {
            const prefix = category === 'chain' ? 'Chain' : '';
            if (existsSync(`./raw/${category}s/${prefix}${foundLogo.name}`)) {
                return;
            }
            console.log('Found alternate logo:', foundLogo.name);
            downloadLogos(category, foundLogo);
        });
    });
}

async function searchLogos() {
    console.log('🏗 Fetching logo files...');
    const foundLogos = await fetchLogos();

    missingLogos.map((missingLogoCategory) => {
        missingLogoCategory.logos.map((missingLogo) => {
            foundLogos.map((foundLogo) => {
                if (utils.sanitizeName(foundLogo.name).toLowerCase() === `${utils.sanitizeName(missingLogo).toLowerCase()}`) {
                    downloadLogos(missingLogoCategory.category, foundLogo);
                }
            });
        });
    });

    console.log('🏗 Checking for alternate logos...');
    await checkAlternateLogos(foundLogos) // Check for alternate logos
    console.log('✅ Finished fetching logo files.');
}

async function fetchLogos() {
    const dbx = await getDropbox();
    try {
        const response = await dbx.filesListFolder({ path: '', recursive: true });
        return response.result.entries;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function saveToDisk(prefix, file, category, blob) {
    fs.writeFile(`./raw/${category}s/${prefix}${file}`, blob, function (err) {
        if (err) {
            console.error(err);
        }
    });
}

async function downloadLogos(category, file) {
    const prefix = category === 'chain' ? 'Chain' : '';
    if (existsSync(`./raw/${category}s/${prefix}${file.name}`)) {
        console.log(`File ${file.name} already exists`);
        return;
    }


    const dbx = await getDropbox();
    try {
        const response = await dbx.filesDownload({ path: file.path_lower });
        var blob = response.result.fileBinary;
        await saveToDisk(prefix, file.name, category, blob);
        console.log(`Downloaded ${file.name}`);
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
