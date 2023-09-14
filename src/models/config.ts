import mongoose, { model, SchemaOptions, Schema } from 'mongoose';

const configSchema = new mongoose.Schema(
    {
        joinToCreate: {
            type: String,
            required: true,
        },
        joinToCreateParent: {
            type: String,
            required: true,
        },
        stuffChannel: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        body: {
            type: Schema.Types.ObjectId,
            ref: 'ReactionCategory',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model('ConfigGuild', configSchema);
