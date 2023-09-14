import mongoose, { Schema, model } from 'mongoose';

const ReactionRoles = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'RoleCategory',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    roleDescription: {
        type: String,
        default: null,
    },
    roleEmoji: {
        type: String,
        default: null,
    },
});

export default model('ReactionRoles', ReactionRoles);
