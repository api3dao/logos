require('dotenv').config();
const fs = require('fs/promises');
const utils = require('../helpers/utils');
const dropbox = require('dropbox');
const fetch = require('node-fetch');
const crypto = require('crypto');

const categories = ['chain', 'symbol', 'api-provider'];

let dbx = null;

async function initDropbox() {
    console.log('🏗 Initializing Dropbox...');
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = `https://api.dropbox.com/oauth2/token?refresh_token=${process.env.DROPBOX}&grant_type=refresh_token&client_id=${process.env.APP_KEY}&client_secret=${process.env.APP_SECRET}`;
    const response = await fetch(url, options);

    const data = await response.json();
    dbx = new dropbox.Dropbox({ accessToken: data.access_token });

    console.log('✅ Finished initializing Dropbox.');
    return dbx;
}

async function getDropbox() {
    return dbx || (await initDropbox());
}

function getLogoList(mode) {
    switch (mode) {
        case 'chain':
            return [...utils.getManualLogos(mode), ...utils.getSupportedChains()];
        case 'symbol':
            return [...utils.getManualLogos(mode), ...utils.getSupportedFeeds()];
        case 'api-provider':
            return [...utils.getManualLogos(mode), ...utils.getApiProviders()];
        default:
            break;
    }
}

async function calcHash(dir, file) {
    try {
        const fileBuffer = await fs.readFile(`${dir}/${file}`);
        //hash 2 times to get the same hash as dropbox
        const hashSum1 = crypto.createHash('sha256');
        hashSum1.update(fileBuffer);
        const hex = hashSum1.digest('hex');
        const binary = Buffer.from(hex, 'hex');
        const hashSum2 = crypto.createHash('sha256');
        hashSum2.update(binary);
        return hashSum2.digest('hex');
    } catch (error) {
        console.error(error);
        return '';
    }
}

async function getLogoFileHashes(dir, mode) {
    const files = await fs.readdir(dir, 'utf-8');

    const logos = getLogoList(mode);
    const prefix = mode === 'chain' ? 'Chain' : '';
    const foundLogos = logos.filter((logo) =>
        files.find(
            (file) => utils.sanitizeName(file).toLowerCase() === `${utils.sanitizeName(logo, '', prefix).toLowerCase()}`
        )
    );

    const sanitize = [...new Set(foundLogos)];

    return await Promise.all(
        sanitize.map(async (logo) => {
            const fileName = utils.sanitizeName(logo).toLowerCase();
            return {
                name: logo,
                hash: await calcHash(dir, `${prefix}${fileName}.svg`)
            };
        })
    );
}

async function checkLogos() {
    let curentLogosList = [];

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const logos = await getLogoFileHashes(`./raw/${category}s`, category);

        curentLogosList.push({
            category: category,
            logos: logos
        });
    }

    return curentLogosList;
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

async function compareLogos(curentLogosList, foundLogos) {
    console.log('🏗 Comparing logo files...');
    console.log('Found logos:', foundLogos.length);

    for (let i = 0; i < curentLogosList.length; i++) {
        const category = curentLogosList[i].category;
        const logos = curentLogosList[i].logos;

        console.log(`Checking ${category} logos...`);

        for (let j = 0; j < logos.length; j++) {
            const logo = logos[j];
            const foundLogo = foundLogos.find(
                (file) => file.name === `${utils.sanitizeName(logo.name).toLowerCase()}.svg`
            );
            if (!foundLogo) {
                console.log(`❌ ${logo.name} not found in Dropbox.`);
            } else if (foundLogo.content_hash !== logo.hash) {
                console.log(`❌ ${logo.name} hash mismatch.`);
            } else {
                console.log(`✅ ${logo.name} is up to date.`);
            }
        }
    }
}

async function main() {
    console.log('🏗 Checking logo files...');

    const curentLogosList = await checkLogos();
    const foundLogos = await fetchLogos();

    await compareLogos(curentLogosList, foundLogos);

    console.log('✅ Finished checking logo files.');
}

main();
