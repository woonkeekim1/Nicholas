const mongoose = require("mongoose");

const chatRoomUserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
  chatId:{type: mongoose.Schema.Types.ObjectId, ref: "Chatroom"},
	lastReadDate: {type:Date, default: Date.now()},
});

module.exports = mongoose.model("ChatroomUser", chatRoomUserSchema);
