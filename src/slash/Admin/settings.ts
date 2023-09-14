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
import MainChannelBody from '../../models/Roles';
import Config from '../../models/config';
import { toJson } from '../../utils';
export default {
    name: 'configuration',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Setup your site in a prefered way',
    options: [
        {
            name: 'jointocreate',
            description:
                'Choose a channel for the join to create endPoint (Voice channels only)',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'jointocreatebody',
            description:
                'Choose a category for the join to create endPoint (Category only)',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'stuffchannel',
            description:
                'Choose a text channel where Stuff will be getting notified (Text Channels only)',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member, guildId } = interaction;
        const selectedVoiceJoinPoint = options.getChannel('jointocreate');
        const selectedCategoryAppendPoint =
            options.getChannel('jointocreatebody');
        const selectedStuffChannel = options.getChannel('stuffchannel');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            let channelObject = guild.channels.cache.get(
                selectedVoiceJoinPoint.id
            );

            if (channelObject.type !== 2) {
                embed
                    .setDescription(
                        `\`🔊\` | **Error:** \`Join to create only accepts **Voice channels**\``
                    )
                    .setColor('Red');

                return interaction.followUp({ embeds: [embed] });
            }

            channelObject = guild.channels.cache.get(
                selectedCategoryAppendPoint.id
            );

            if (channelObject.type !== 4) {
                embed
                    .setDescription(
                        `\`🔊\` | **Error:** \`Join to create body only accepts **Category channels**\``
                    )
                    .setColor('Red');

                return interaction.followUp({ embeds: [embed] });
            }

            channelObject = guild.channels.cache.get(selectedStuffChannel.id);

            if (channelObject.type !== 0) {
                embed
                    .setDescription(
                        `\`🔊\` | **Error:** \`Stuff channel only accepts **Text channels**\``
                    )
                    .setColor('Red');

                return interaction.followUp({ embeds: [embed] });
            }

            const data = await MainChannelBody.findOne({ GuildID: guildId });

            const newConfig = {
                joinToCreate: selectedVoiceJoinPoint.id,
                joinToCreateParent: selectedCategoryAppendPoint.id,
                stuffChannel: selectedStuffChannel.id,
                guildId: guildId,
                body: data?._id,
            };

            if (data) {
                await data.save();

                const configCheck = await Config.findOne({ body: data._id });

                if (configCheck) {
                    await Config.findByIdAndUpdate(configCheck._id, {
                        $set: newConfig,
                    });
                } else {
                    await new Config({ ...newConfig }).save();
                }
            } else {
                const Main = await MainChannelBody.create({
                    GuildID: guildId,
                });
                newConfig.body = Main._id;
                await new Config({ ...newConfig }).save();
            }

            channelObject = guild.channels.cache.get(selectedStuffChannel.id);

            embed
                .setDescription(
                    `\`🔊\` | **Inform:** \`This is where all the notifications will be showing. **${member.user.username}**\``
                )
                .setColor('Blue');

            await channelObject.send({ embeds: [embed] });

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Server configuration was set up successfully **${member.user.username}**\``
                )
                .setColor('Blue');

            return interaction.followUp({ embeds: [embed] });
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
