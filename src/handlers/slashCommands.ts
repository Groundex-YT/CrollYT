import { AsciiTable3 } from 'ascii-table3';
import { promises as fs } from 'fs';
import { REST } from '@discordjs/rest';
import DC from 'discord.js';
import path, { join } from 'path';
import ClientProps from '../index';

export default async (client: typeof ClientProps) => {
    const Table = new AsciiTable3('Slash commands loaded').setHeading(
        'file',
        'status'
    );

    let eventsDir = path.join(__dirname, '..', 'slash');

    const dirNames = await fs.readdir(eventsDir);
    const commandsArray: any[] = [];

    for (const i in dirNames) {
        let dir = path.join(__dirname, '..', 'slash', dirNames[i]);
        let files = await fs.readdir(dir);

        files.forEach(async (file) => {
            let event = require(`${dir}/${file}`);

            event = event.default;

            if (!event.name) {
                const L = file.split('/');
                await Table.addRow(
                    `${file || 'MISSING'}`,
                    `⛔ Slash name is either invalid or missing: ${
                        L[6] + '/' + L[7]
                    }`
                );
                return;
            }

            if (!event.description)
                return Table.addRow(
                    `${event.name}`,
                    '♦ FAILED',
                    `Missing a description`
                );

            // if (event.permission) {
            //     if (Perms.includes(event.permission))
            //         event.defaultPermission = false;
            //     else
            //         return Table.addRow(
            //             `${event.name}`,
            //             '♦ FAILED',
            //             `Permission invalid`
            //         );
            // }

            client.slashCommands.set(event.name, event);
            commandsArray.push(event);

            await Table.addRow(event.name, '✔ SUCCESSFUL');
        });
    }

    console.log(Table.toString());

    const rest = new REST({ version: '10' }).setToken(client.settings.TOKEN);

    client.on('ready', async () => {
        const guild_ids = await client.guilds.cache.map((guild) => guild.id);

        try {
            for (const guildId of guild_ids) {
                await rest.put(
                    DC.Routes.applicationGuildCommands(
                        `${client.settings.CLIENT_ID}`,
                        `${guildId}`
                    ),
                    {
                        body: commandsArray,
                    }
                );
            }
        } catch (err) {
            console.log(err);
        }
    });
};
