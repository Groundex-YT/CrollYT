import dotenv from 'dotenv';
import StudyBot from './structures/StudyBot';
import http from 'http';

dotenv.config();

http.createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);

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
