#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const utils = require('../helpers/utils');

const FILE_PATH = path.resolve(process.cwd(), 'extension.json');

const [, , type, rawValues] = process.argv;

if (!type) {
    console.error(
        'Usage:\n' +
            '  node extend-json.js <chains|symbols|api-providers> <v1,v2,...>\n' +
            '  node extend-json.js <chains|symbols|api-providers> --clear\n' +
            '  node extend-json.js auto-clear'
    );
    process.exit(1);
}

const ALLOWED_KEYS = ['chains', 'symbols', 'api-providers', 'auto-clear'];

if (!ALLOWED_KEYS.includes(type)) {
    console.error(`Invalid type. Allowed: ${ALLOWED_KEYS.join(', ')}`);
    process.exit(1);
}

const isAutoClear = type === 'auto-clear';
const isClear = rawValues === '--clear' || isAutoClear;

// Load or initialize file
let data = {
    chains: [],
    symbols: [],
    'api-providers': []
};

if (fs.existsSync(FILE_PATH)) {
    try {
        data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    } catch {
        console.error('extension.json is not valid JSON');
        process.exit(1);
    }
}

const TARGET_KEYS = isAutoClear ? ['chains', 'symbols', 'api-providers'] : [type];

/* =======================
   CLEAR MODE
======================= */
if (isClear) {
    if (isAutoClear) {
        const supportedChains = utils.getSupportedChains();
        const supportedFeeds = [
            ...new Set(
                utils
                    .getSupportedFeeds()
                    .map((feed) => feed.split('/'))
                    .flat()
            )
        ];
        const apiProviders = utils.getApiProviders();

        let totalCleared = 0;

        // Chains
        const initialChainCount = data.chains.length;
        data.chains = data.chains.filter((chain) => !supportedChains.includes(chain));
        totalCleared += initialChainCount - data.chains.length;

        // Symbols
        const initialSymbolCount = data.symbols.length;
        data.symbols = data.symbols.filter((symbol) => !supportedFeeds.includes(symbol));
        totalCleared += initialSymbolCount - data.symbols.length;

        // API Providers
        const initialApiProviderCount = data['api-providers'].length;
        data['api-providers'] = data['api-providers'].filter((provider) => !apiProviders.includes(provider));
        totalCleared += initialApiProviderCount - data['api-providers'].length;

        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

        console.log(`Auto-cleared a total of ${totalCleared} unsupported values.`);
    } else {
        for (const key of TARGET_KEYS) {
            if (!Array.isArray(data[key])) data[key] = [];
            data[key] = [];
        }

        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
        console.log(`Cleared all values from "${type}"`);
    }

    process.exit(0);
}

/* =======================
   ADD MODE
======================= */
if (!rawValues) {
    console.error('No values provided');
    process.exit(1);
}

const values = rawValues
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

if (values.length === 0) {
    console.error('No valid values provided');
    process.exit(1);
}

const key = type;

if (!Array.isArray(data[key])) {
    data[key] = [];
}

let added = [];

for (const value of values) {
    if (!data[key].includes(value)) {
        data[key].push(value);
        added.push(value);
    }
}

if (added.length > 0) {
    console.log(`Added to "${key}": ${added.join(', ')}`);
} else {
    console.log(`No new values added to "${key}"`);
}

// Write back
fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
