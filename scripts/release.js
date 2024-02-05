const fs = require('fs/promises');

async function getChangeset() {
    return await fs.readdir('./.changeset');
}

async function createChangeset() {
    const changeset = `---
"@phase21/logos": patch
---

# What's Changed
Auto-generated changeset by the release script.
`;
    await fs.writeFile('./.changeset/changeset.md', changeset);
    console.log('✨ Created changeset file.');
}


async function checkChangeset() {
    const changeset = await getChangeset();
    if (changeset.some(file => file.endsWith('.md'))) {
        console.log('There is already a .md file in the .changeset directory.');
    } else {
        await createChangeset();
    }
    await createChangeset();
}

async function main() {
    console.log('🏗 Checking changeset files...');
    Promise.all([checkChangeset()]).then(() => console.log('✅ Finished checking changeset files.'));
}

main();
