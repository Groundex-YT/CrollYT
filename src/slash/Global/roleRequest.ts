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
import Requests from '../../models/requests';
import { toJson } from '../../utils';
import MainGuildChannel from '../../models/Roles';

export default {
    name: 'requestrole',
    category: 'Global',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Request a role and once aproved by stuff you will get it.',
    options: [
        {
            name: 'role',
            description: 'Choose a role that you would to make a request on',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'description',
            description: 'Why you need the role.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member, guildId } = interaction;
        const selectedRole = options.getRole('role');
        const selectedDescription = options.getString('description');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            const data = await MainGuildChannel.findOne({ GuildID: guildId });

            const newRoleRequest = new Requests({
                body: data?._id,
                roleId: selectedRole.id,
                roleName: selectedRole.name,
                description: selectedDescription,
                user: member.user.id,
            });

            if (data) {
                await newRoleRequest.save();
            } else {
                const Main = await MainGuildChannel.create({
                    GuildID: guildId,
                });

                newRoleRequest.body = Main._id;

                await newRoleRequest.save();
            }

            embed
                .setDescription(
                    `\`🔊\` | **Success:** \`Role requested is sent to the staff **${member.user.username}**\``
                )
                .setColor('Blue');

            interaction.followUp({ embeds: [embed] });
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
