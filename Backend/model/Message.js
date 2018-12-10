const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId, 
	sentFrom: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	sentTo: {type: mongoose.Schema.Types.ObjectId, ref: "Chatroom"},
	body: String,
	picture: String,
	sentBy: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Message", messageSchema);