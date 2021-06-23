const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: {
        type: String,
        reqired: true
    },
    photo: {
        data: Buffer,
        type: String
    },
    comments: [{
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', PostSchema);