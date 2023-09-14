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
    name: 'removerole',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'remove a role assignable to all users',
    options: [
        {
            name: 'category',
            description: 'Get roles based on the category you pick.',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
        {
            name: 'role',
            description: 'role to be remove.',
            type: ApplicationCommandOptionType.Role,
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
        const selectedRole = options.getRole('role');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            let categories = await Category.findOne({ _id: selectedCategory });
            let roles = await Roles.find({ category: categories?._id });

            //@ts-ignore
            if (!roles.length > 0) {
                embed
                    .setAuthor({ name: 'logger' })
                    .setDescription(
                        `\`🧾\` | **There're no roles in the (Category) at the momemt:** \`Error\``
                    )
                    .setColor('Blue');
                return interaction.followUp({ embeds: [embed] });
            }

            let roleData = roles.find((x) => x.roleId === selectedRole.id);

            if (!roleData) {
                embed
                    .setAuthor({ name: 'logger' })
                    .setDescription(
                        `\`🧾\` | **This role does not exist** \`Error\``
                    )
                    .setColor('Blue');
                return interaction.followUp({ embeds: [embed] });
            }

            await Roles.findOneAndDelete({ roleId: selectedRole.id });

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Removed the role **${selectedRole.name}**\``
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
