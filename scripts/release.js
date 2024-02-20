const fs = require('fs/promises');

async function getChangeset() {
    return await fs.readdir('./.changeset');
}

async function getDetails() {
    try {
        const details = await fs.readFile('./.changeset/details.txt', 'utf-8');
        return details;
    } catch (error) {
        return '';
    }
}

async function createChangeset() {
    const details = await getDetails();

    const changeset =
        `---
"@phase21/logos": patch
---

Some changes have been made to the \`logos\`.

|Logo|Name|Category|
|---|---|---|
` + details;

    await fs.writeFile('./.changeset/changeset.md', changeset);
    console.log('✨ Created changeset file.');
}

async function checkChangeset() {
    const changeset = await getChangeset();
    if (changeset.some((file) => file.match(/changeset.md$/))) {
        console.log('There is already a .md file in the .changeset directory.');
    } else {
        await createChangeset();
    }
}

async function main() {
    console.log('🏗 Checking changeset files...');
    Promise.all([checkChangeset()]).then(() => console.log('✅ Finished checking changeset files.'));
}

main();
