import {createWriteStream, existsSync, mkdirSync} from 'node:fs';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import path from 'node:path';

const releaseBase = 'https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0';
const appsDirectory = path.resolve('apps');
const assets = [
    'android.wdio.native.app.v2.2.0.apk',
    'ios.simulator.wdio.native.app.v2.2.0.zip',
];

mkdirSync(appsDirectory, {recursive: true});

for (const asset of assets) {
    const destination = path.join(appsDirectory, asset);
    if (existsSync(destination)) {
        console.log(`Ja existe: ${destination}`);
        continue;
    }

    console.log(`Baixando ${asset}...`);
    const response = await fetch(`${releaseBase}/${asset}`);
    if (!response.ok || !response.body) {
        throw new Error(`Falha ao baixar ${asset}: HTTP ${response.status}`);
    }

    await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
    console.log(`Salvo em ${destination}`);
}
