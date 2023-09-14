import ClientProps from '../../index';
import {
    Interaction,
    EmbedBuilder,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ChannelType,
    PermissionFlagsBits,
} from 'discord.js';
import { channel } from 'diagnostics_channel';
import { toJson } from '../../utils';

export default {
    name: 'channel',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'create a custom channel',
    options: [
        {
            name: 'channel',
            description:
                'What category would you like the channel to be under.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'type',
            description: 'What type of channel would you like to be create.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'voice',
                    value: 'voice',
                },
                {
                    name: 'text',
                    value: 'text',
                },
            ],
        },
        {
            name: 'title',
            description: 'Name of the channel that you are about to create.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'limit',
            description:
                'User limits of the channel that you are about to create.',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member } = interaction;
        const selectedChannel = options.getChannel('channel');
        const selectedType = options.getString('type');
        const selectedTitle = options.getString('title');
        const selectedLimit = options.getNumber('limit');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            if (selectedType === 'text') {
                if (selectedChannel.type === 4) {
                    guild.channels.create({
                        name: selectedTitle,
                        type: ChannelType.GuildText,
                        parent: selectedChannel.id,
                    });

                    embed
                        .setAuthor({ name: 'Text channel logger' })
                        .setDescription(
                            `\`🧾\` | **You have successduly created the channel of type:** \`text\``
                        );
                } else {
                    embed
                        .setAuthor({ name: 'Text channel logger' })
                        .setDescription(
                            `\`🛑\` | **Channel was not created! Please choose the ones with folder:** \`Error\``
                        );
                }
            } else {
                if (selectedChannel.type === 4) {
                    let ops = {
                        name: selectedTitle,
                        type: ChannelType.GuildVoice,
                        parent: selectedChannel.id,
                    };

                    //@ts-ignore

                    if (selectedLimit) ops.userLimit = selectedLimit;

                    guild.channels.create(ops);

                    embed
                        .setAuthor({ name: 'Voice channel logger' })
                        .setDescription(
                            `\`🔊\` | **You have successduly created the channel of type:** \`voice\``
                        );
                } else {
                    embed
                        .setAuthor({ name: 'Voice channel logger' })
                        .setDescription(
                            `\`🛑\` | **Channel was not created! Please choose the ones with folder:** \`Error\``
                        );
                }
            }

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            embed
                .setDescription(
                    `\`🔊\` | **Error:** \`Global error check with the dev **${member.user.username}**\``
                )
                .setColor('Red');

            interaction.followUp({ embeds: [embed] });
        }
    },
};
