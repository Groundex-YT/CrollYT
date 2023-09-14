import clientProp from '../..';
import {
    ChannelType,
    VoiceStateManager,
    PermissionFlagsBits,
    EmbedBuilder,
} from 'discord.js';
import { toJson } from '../../utils';
import MainGuildBody from '../../models/Roles';
import Config from '../../models/config';

const voiceStateUpdate = {
    name: 'voiceStateUpdate',
    async execute(client: typeof clientProp, oS: any, nS: any) {
        const { member, guild } = oS;
        const oldChannel = oS.channel;
        const newChannel = nS.channel;

        const guildId = guild.id;

        const embed = new EmbedBuilder().setColor('#36393F').setTimestamp();

        try {
            // getting settings for the guild from the database;
            const data = await MainGuildBody.findOne({ GuildID: guildId });

            if (!data) return;

            const settings = await Config.findOne({ body: data?._id });

            if (!settings) return;

            const Body = settings.joinToCreateParent;
            const JTC = settings.joinToCreate;

            // When user join the vc channel
            if (
                !oldChannel !== newChannel &&
                newChannel &&
                newChannel.id === JTC
            ) {
                const voiceChannel = await guild.channels.create({
                    name: `🔊-${member.user.username}`,
                    type: ChannelType.GuildVoice,
                    parent: Body,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [
                                toJson(PermissionFlagsBits.Connect),
                                toJson(PermissionFlagsBits.ManageChannels),
                            ],
                        },
                        {
                            id: guild.id,
                            allow: [toJson(PermissionFlagsBits.Connect)],
                        },
                    ],
                });

                client.voiceManager.set(member.id, voiceChannel.id);

                await newChannel.permissionOverwrites.edit(member, {
                    Connect: false,
                });

                setTimeout(() => {
                    newChannel.permissionOverwrites.delete(member);
                }, 30 * 1000);

                return setTimeout(() => {
                    member.voice.setChannel(voiceChannel);
                }, 600);
            }

            const focusedChannel = client.voiceManager.get(member.id);
            const members = oldChannel?.members
                .filter((m: any) => !m.user.bot)
                .map((m: any) => m.id);

            // when user leave the vc channel
            if (
                focusedChannel &&
                oldChannel.id === focusedChannel &&
                (!newChannel || newChannel.id !== focusedChannel)
            ) {
                if (members.length > 0) {
                    let randomId =
                        members[Math.floor(Math.random() * members.length)];
                    let randomMember = guild.members.cache.get(randomId);
                    randomMember.voice.setChannel(oldChannel).then((v: any) => {
                        embed
                            .setDescription(
                                `\`🔊\` | **Grants:** \`You're now owner of **${oldChannel}** Voice channel\``
                            )
                            .setColor('Blue');
                        randomMember.send({ embeds: [embed] });
                        oldChannel
                            .setName(randomMember.user.username)
                            .catch((e: any) => null);
                        oldChannel.permissionOverwrites.edit(randomMember, {
                            Connect: true,
                            ManageChannels: true,
                        });
                    });

                    client.voiceManager.set(member.id, null);
                    client.voiceManager.set(randomMember.id, oldChannel.id);
                } else {
                    client.voiceManager.set(member.id, null);
                    oldChannel.delete().catch((e: any) => {
                        console.log(e);
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};

export default voiceStateUpdate;
