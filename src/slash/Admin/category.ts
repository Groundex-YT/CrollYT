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
import Category from '../../models/RoleCategory';
import { toJson } from '../../utils';

export default {
    name: 'addcategory',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Create a category for assignable roles to all users.',
    options: [
        {
            name: 'category',
            description: 'role to be assigned.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'description',
            description: 'description of the role.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'emoji',
            description: 'Emoji for the role.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member, guildId } = interaction;
        const selectedTitle = options.getString('category');
        const selectedDescription = options.getString('description');
        const selectedEmoji = options.getString('emoji');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            const data = await MainChannelBody.findOne({ GuildID: guildId });

            const newCategory = new Category({
                title: selectedTitle,
                description: selectedDescription,
                emoji: selectedEmoji,
                body: data?._id,
            });

            if (data) {
                await data.save();
                await newCategory.save();
            } else {
                const Main = await MainChannelBody.create({
                    GuildID: guildId,
                });
                newCategory.body = Main._id;
                await newCategory.save();
            }

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Created new role category **${selectedTitle.name}**\``
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
