import {
    Client,
    Collection,
    GatewayIntentBits,
    Presence,
    ActivityType,
} from 'discord.js';
import { Settings } from '../types/common';
import events from '../handlers/events';
import slashCommands from '../handlers/slashCommands';
import db from '../config/db';

export default class myApp extends Client {
    settings: Settings;
    slashCommands: Collection<unknown, any>;
    voiceManager: Collection<unknown, any>;

    constructor(options?: any) {
        super(options);
        const { PREFIX, COLOR, TOKEN, CLIENT_ID } = JSON.parse(
            process.env.JSON_ENV!
        );

        this.settings = { COLOR, TOKEN, CLIENT_ID };
        this.slashCommands = new Collection();
        this.voiceManager = new Collection();

        db();

        this.loadEvents();
        this.loadSlashCommands();
    }

    loadEvents() {
        events(this);
    }

    loadSlashCommands() {
        slashCommands(this);
    }

    build() {
        this.login(this.settings.TOKEN);
    }
}
