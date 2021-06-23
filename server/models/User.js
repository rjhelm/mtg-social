const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/],
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    updated: Date, 
    created: {
        type: Date,
        default: Date.now
    },
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        type: String
    },
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

UserSchema.virtual('password').set((password) => {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
}).get(() => {
    return this._password
})

UserSchema.path('hashed_password').validate((v) => {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be 6 characters or more')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.methods = {
    authenticate: ((plainText) => {
        return this.encryptPassword(plainText) === this.hashed_password
    }),
    encryptPassword: ((plainText) => {
        if (!password) return ''
        try {
            return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
            return ''
        }
    }),
    makeSalt: (() => {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    })
}

module.exports = mongoose.model('User', UserSchema);