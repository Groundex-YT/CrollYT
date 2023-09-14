import {
    EmbedBuilder,
    Interaction,
    ApplicationCommandOptionType,
} from 'discord.js';
import ClientProps from '../../index';

export default {
    name: 'interactionCreate',
    async execute(client: typeof ClientProps, interaction: any) {
        const { customId, values, guild, member } = interaction;
        const embed = new EmbedBuilder().setColor('Blue');

        if (interaction.isSelectMenu) {
            if (customId === 'reaction-roles') {
                for (let i = 0; i < values.length; i++) {
                    const roleId = values[i];

                    const role = guild.roles.cache.get(roleId);
                    const hasRole = member.roles.cache.has(roleId);

                    switch (hasRole) {
                        case true:
                            member.roles.remove(roleId);
                            break;
                        case false:
                            member.roles.add(roleId);
                            break;
                    }
                }

                interaction.reply({
                    content: 'Roles updated',
                    ephemeral: true,
                });
            }
        }

        if (interaction.isAutocomplete()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) {
                console.log(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }

        if (!interaction.isChatInputCommand()) return;
        // if(!interaction.isGuild()) return interaction.reply('This command cannot be processed :/');

        await interaction.deferReply().catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd) {
            embed.setDescription(`\`⛔\` | **Error:** \`Unknown command\``);
            interaction.followUp({ embeds: [embed] });
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x: any) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        //@ts-ignore

        interaction.member = interaction?.guild?.members.cache.get(
            interaction.user.id!
        );

        try {
            cmd.execute(client, interaction, args);
        } catch (err) {
            console.log(err);
            embed.setDescription(
                `\`⛔\` | **Error:** \`Processing this command\``
            );
            interaction.followUp({ embeds: [embed] });
        }
    },
};
