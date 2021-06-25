const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const sectionSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        subscribedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        subscriberCount: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

sectionSchema.plugin(uniqueValidator);

schemaCleaner(sectionSchema);

module.exports = mongoose.model('Section', sectionSchema);