import mongoose, { model, SchemaOptions, Schema } from 'mongoose';

const RoleCategorySchema = new mongoose.Schema(
    {
        GuildID: {
            type: String,
            required: true,
        },
        categories: Array,
        config: Array,
    },
    {
        timestamps: true,
    }
);

export default model('ReactionCategory', RoleCategorySchema);
