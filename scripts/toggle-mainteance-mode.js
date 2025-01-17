const fs = require('fs');
const os = require('os');

function setEnvValue(value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync('./.env', 'utf8').split(os.EOL);

    if (!ENV_VARS) {
        console.error('No .env file found');
        throw new Error('No .env file found');
    }

    const line = ENV_VARS.find((line) => {
        return line.includes('VITE_APP_MAINTENANCE_START_TIME');
    });

    if (!line) {
        ENV_VARS.push(`VITE_APP_MAINTENANCE_START_TIME=${value}`);
    }

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(line);

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `VITE_APP_MAINTENANCE_START_TIME=${value}`);

    // write everything back to the file system
    fs.writeFileSync('./.env', ENV_VARS.join(os.EOL));
}

function enableMaintenanceMode(isDelayed) {
    const now = new Date();
    const nowPlus15Minutes = new Date(now.getTime() + 15 * 60000);
    const ticks = isDelayed ? Math.floor(nowPlus15Minutes.getTime() / 1000) : Math.floor(now.getTime() / 1000);
    setEnvValue(ticks.toString());
}

function disableMaintenanceMode() {
    setEnvValue('');
}

function main() {
    const command = process.env.ACTION;

    switch (command) {
        case 'enable':
            enableMaintenanceMode();
            break;
        case 'delayed':
            enableMaintenanceMode(true);
            break;
        case 'disable':
            disableMaintenanceMode();
            break;
        default:
            console.log("No valid command found. Please use 'enable', 'delayed' or 'disable'");
            break;
    }
}

main();
