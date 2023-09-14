import ClientProps from '../../index';
import {
    Interaction,
    EmbedBuilder,
    ApplicationCommandOptionType,
} from 'discord.js';

export default {
    name: 'help',
    aliases: ['h', 'cmd', 'commands', 'hp'],
    usage: 'Or ~!help <Command name>',
    category: 'Utilities',
    description: 'Get all the help available on how to operate this bot',
    options: [
        {
            name: 'command',
            description: 'Get details for a spacific command.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options } = interaction;
        const commandInfo = options.getString('command');

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({
                name: `${interaction?.guild?.me?.displayName} Help Command!`,
                iconURL: interaction?.guild?.iconURL({ dynamic: true }),
            })
            .setThumbnail(
                //@ts-ignore
                client?.user?.displayAvatarURL({ dynamic: true, size: 2048 })
            );
    },
};
