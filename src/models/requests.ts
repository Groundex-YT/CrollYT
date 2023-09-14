import mongoose, { Schema, model } from 'mongoose';

const RequestsSchema = new Schema({
    body: {
        type: Schema.Types.ObjectId,
        ref: 'ReactionCategory',
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

export default model('Requests', RequestsSchema);
