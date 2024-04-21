const mongoose = require("mongoose");
const { User } = require("./userSchema");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);