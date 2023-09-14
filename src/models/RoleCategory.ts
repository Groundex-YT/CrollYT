import mongoose, { model, SchemaOptions, Schema } from 'mongoose';

const RoleCategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        emoji: {
            type: String,
            required: true,
        },
        body: {
            type: Schema.Types.ObjectId,
            ref: 'ReactionCategory',
            required: true,
        },
        roles: Array,
    },
    {
        timestamps: true,
    }
);

export default model('RoleCategory', RoleCategorySchema);
