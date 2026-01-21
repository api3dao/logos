#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(process.cwd(), 'extension.json');

const [, , type, rawValues] = process.argv;

if (!type) {
    console.error(
        'Usage:\n' +
            '  node extend-json.js <chains|symbols|api-providers> <v1,v2,...>\n' +
            '  node extend-json.js <chains|symbols|api-providers> --clear'
    );
    process.exit(1);
}

const ALLOWED_KEYS = ['chains', 'symbols', 'api-providers'];

if (!ALLOWED_KEYS.includes(type)) {
    console.error(`Invalid type. Allowed: ${ALLOWED_KEYS.join(', ')}`);
    process.exit(1);
}

const isClear = rawValues === '--clear';

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

// Ensure array exists
if (!Array.isArray(data[type])) {
    data[type] = [];
}

/* =======================
   CLEAR MODE
======================= */
if (isClear) {
    data[type] = [];
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`Cleared all values from "${type}"`);
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

let added = [];

for (const value of values) {
    if (!data[type].includes(value)) {
        data[type].push(value);
        added.push(value);
    }
}

if (added.length > 0) {
    console.log(`Added to "${type}": ${added.join(', ')}`);
} else {
    console.log(`No new values added to "${type}"`);
}

// Write back
fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
