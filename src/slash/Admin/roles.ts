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
import Role from '../../models/ReactionRoles';
import { toJson } from '../../utils';

export default {
    name: 'addrole',
    category: 'Admin',
    description: 'Create a role assignable to all users.',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    options: [
        {
            name: 'category',
            description: 'role to be assigned.',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: 'role',
            description: 'Create the role.',
            type: ApplicationCommandOptionType.Role,
            required: false,
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
        const selectedDescription = options.getString('description');
        const selectedEmoji = options.getString('emoji');

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

            const newRole = new Role({
                name: selectedRole.name,
                roleId: selectedRole.id,
                roleDescription: selectedDescription,
                roleEmoji: selectedEmoji,
                category: categories?._id,
            });

            if (categories) {
                let roleData = await Role.findOne({ roleId: selectedRole.id });

                if (roleData) {
                    embed
                        .setDescription(
                            `\`🔊\` | **Success:** \`Role is already been created **${selectedRole.name}**\``
                        )
                        .setColor('Aqua');

                    return interaction.followUp({ embeds: [embed] });
                } else {
                    await newRole.save();
                }
            }

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Created new role **${selectedRole.name}**\``
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
