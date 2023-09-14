import dotenv from 'dotenv';
import StudyBot from './structures/StudyBot';

dotenv.config();

const client = new StudyBot({
    intents: ['Guilds', 'GuildVoiceStates'],
    presence: {
        activities: [
            {
                name: '~!help',
                type: 'LISTENING',
                url: 'https://www.twitch.tv/lunaoni',
            },
        ],
        status: 'online',
    },
});

client.build();

export default client;
