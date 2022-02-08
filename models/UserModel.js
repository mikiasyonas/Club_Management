const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
    },
    telegramUserName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "member",
        enum: ["member", "division_president", "president"]
    },
    division: { 
        type: String
    },
    accessToken: {
        type: String
    },
    telegramId: {
        type: Number
    },
    subscribed: {
        type: Boolean
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;