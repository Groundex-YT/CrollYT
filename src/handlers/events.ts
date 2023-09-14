import { AsciiTable3 } from 'ascii-table3';
import { promises as fs } from 'fs';
import path, { join } from 'path';
import ClientProps from '../index';

export default async (client: typeof ClientProps) => {
    const Table = new AsciiTable3('Events Loaded').setHeading('file', 'status');

    let eventsDir = path.join(__dirname, '..', 'events');

    const dirNames = await fs.readdir(eventsDir);

    for (const i in dirNames) {
        let dir = path.join(__dirname, '..', 'events', dirNames[i]);
        let files = await fs.readdir(dir);

        files.forEach(async (file) => {
            let event = require(`${dir}/${file}`);

            event = event.default;

            if (!event.name) {
                const L = file.split('/');
                await Table.addRow(
                    `${event.name || 'MISSING'}`,
                    `⛔ Event name is either invalid or missing: ${
                        L[6] + '/' + L[7]
                    }`
                );
                return;
            }

            if (event.once) {
                client.once(event.name, (...args) =>
                    event.execute(client, ...args)
                );
            } else {
                client.on(event.name, (...args) =>
                    event.execute(client, ...args)
                );
            }

            await Table.addRow(event.name, '✔ SUCCESSFUL');
        });
    }

    console.log(Table.toString());
};
