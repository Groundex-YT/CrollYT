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
import Requests from '../../models/requests';
import { toJson } from '../../utils';

export default {
    name: 'requeue',
    category: 'Admin',
    default_member_permissions: toJson(PermissionFlagsBits.Administrator),
    description: 'Displays all the role requests',
    options: [
        {
            name: 'page',
            description: 'Page number of the queue',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],
    async execute(client: typeof ClientProps, interaction: any, args: any) {
        const { commandName, options, member, guildId } = interaction;
        const selectedPage = options.getNumber('page');

        const guild = interaction.guild;
        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            const data = await MainGuildBody.findOne({ GuildID: guildId });

            if (!data) {
                embed
                    .setAuthor({ name: 'logger' })
                    .setDescription(
                        `\`🧾\` | **Server has not yet been registered in the database** \`Error\``
                    )
                    .setColor('Blue');
                return interaction.followUp({ embeds: [embed] });
            }

            let requests = await Requests.find({ body: data._id });

            //@ts-ignore
            if (!requests.length > 0) {
                embed
                    .setAuthor({ name: 'logger' })
                    .setDescription(
                        `\`🧾\` | **There are not role requests made yet** \`Inform\``
                    )
                    .setColor('Blue');
                return interaction.followUp({ embeds: [embed] });
            }

            console.log(requests);

            // embed
            //     .setDescription(
            //         `\`🔊\` | **Success:** \`Removed the role **${selectedRole.name}**\``
            //     )
            //     .setColor('Blue');

            // return interaction.followUp({ embeds: [embed] });
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
