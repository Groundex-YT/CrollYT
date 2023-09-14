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
import MainGuildBody from '../../models/Roles';
import Category from '../../models/RoleCategory';
import Roles from '../../models/ReactionRoles';
import { toJson } from '../../utils';

export default {
    name: 'removecategory',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Remove a category.',
    options: [
        {
            name: 'category',
            description: 'Remove role category.',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
    ],
    async autocomplete(interaction: any) {
        const { commandName, member, guildId, channel } = interaction;
        const focusedValue = interaction.options.getString('category');

        const data = await MainGuildBody.findOne({ GuildID: guildId });
        let categories = await Category.find({ body: data?._id });

        const filtered = categories.filter((choice) =>
            choice.title.startsWith(focusedValue)
        );
        await interaction.respond(
            filtered.map((choice) => ({
                name: choice.title,
                value: choice._id,
            }))
        );
    },
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member, guildId } = interaction;
        const selectedCategory = options.getString('category');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            try {
                const isValid = await Category.findOne({
                    _id: selectedCategory,
                });
            } catch (err) {
                embed
                    .setDescription(
                        `\`🔊\` | **Error:** \`Invalid category. Pls create a new category **True**\``
                    )
                    .setColor('Red');

                return interaction.followUp({ embeds: [embed] });
            }

            await Category.findOneAndDelete({ _id: selectedCategory });

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Removed category successfully **True**\``
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
