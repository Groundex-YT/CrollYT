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
import MainGuildBody from '../../models/Roles';
import Category from '../../models/RoleCategory';
import Roles from '../../models/ReactionRoles';
import { toJson } from '../../utils';

export default {
    name: 'panel',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Display reaction role panel based on the category you pick.',
    options: [
        {
            name: 'category',
            description: 'Get roles based on the category you pick',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
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
        const { commandName, member, guildId, channel, options } = interaction;
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

            let categories = await Category.findOne({ _id: selectedCategory });
            let availableRoles = await Roles.find({
                category: categories?._id,
            });

            // @ts-ignore
            if (!availableRoles.length > 0) {
                embed
                    .setAuthor({ name: 'logger' })
                    .setDescription(
                        `\`🧾\` | **no roles for (category) commited yet** \`Error\``
                    )
                    .setColor('Blue');
                return interaction.followUp({ embeds: [embed] });
            }

            embed
                .setDescription(
                    `Please select your role for (${categories?.title}) below`
                )
                .setColor('Blue');

            //@ts-ignore
            const options = availableRoles.map((x) => {
                return {
                    label: x.name,
                    value: x.roleId,
                    description: x.roleDescription,
                    emoji: x.roleEmoji,
                };
            });

            const menu = new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId('reaction-roles')
                    .setMaxValues(options?.length!)
                    .addOptions(options!)
            );

            await channel.send({ embeds: [embed], components: [menu] });

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Successfuly sent your **panel**\``
                )
                .setColor('Blue');

            return interaction.followUp({ embeds: [embed], ephemeral: true });
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
