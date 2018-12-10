const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	roomName:{type:String, required: true},
	usersList:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	lastModifiedDate: {type:Date, default: Date.now()},
	lastMessage: String,
	isChannel: Boolean
});

module.exports = mongoose.model("Chatroom", chatRoomSchema);
