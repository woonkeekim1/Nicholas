const express = require("express")
const chatRoom = express.Router();
const mongoose = require("mongoose")

const Chatroom = require("../model/Chatroom");
const ChatroomUser = require("../model/ChatroomUser");
const auth = require("../middleware/auth");

chatRoom.post("/", auth, (req, res, next) => {
	if (!req.body.usersList || !req.body.usersList.includes(req.userInfo._id)) {
		return res.status(404).json({
			error: {
				message: 'User must be in the user list of the chatroom'
			}
		})
	}
	if(!req.body.usersList.includes(req.userInfo._id)) {
		res.status(404).json({
			error: {
				message: "Requested User is not included in the User List"
			}
		})
		return res;
	}
	const chatRoom = new Chatroom({
		_id: new mongoose.Types.ObjectId(),
		roomName: req.body.roomName,
		usersList: req.body.usersList,
		isChannel: req.body.isChannel
	})
	chatRoom.save()
	.then(chatRoomResponse => {
		res.status(200).json({
			message: "Chatroom has been created"
		})
	})
	.catch(error =>{
		res.status(404).json({
			error: {
				message: error
			}
		})
	})
});

chatRoom.get("/", auth, (req, res, next)=>{
	const userId = req.userInfo._id;
	Chatroom
	.find({usersList: userId})
	.select('lastModifiedDate _id roomName usersList lastMessage isChannel')
	.sort({lastModifiedDate: -1})
	.exec()
	.then(response =>{
		res.status(200).json({
			chatroomList: response
		})
	})
	.catch(error =>{
		res.status(404).json({
			error: {
				message: error
			}
		})
	})
});

chatRoom.get("/:id", auth, (req, res, next)=>{
	const userId = req.userInfo._id;
	Chatroom
	.find({usersList: userId, _id: req.params.id})
	.populate("usersList")
	.select('lastModifiedDate _id roomName usersList lastMessage')
	.exec()
	.then(response =>{
		res.status(200).json({
			chatroomList: response
		})
	})
	.catch(error =>{
		res.status(404).json({
			error: {
				message: error
			}
		})
	})
});

chatRoom.delete("/:id", auth, (req, res, next)=>{
	const chatRoomId = req.params.id;
	const userId = req.userInfo._id;
	Chatroom
	.find({
		_id: chatRoomId,
		usersList: userId
	})
	.exec()
	.then(response =>{
		if(!response || response.length == 0) {
			res.status(404).json({
				error: {
					message: "Chatroom cannot be found"
				}
			})
			return res;
		}
		const newUsersList = response[0].usersList.filter(temp => temp != userId);
		Chatroom
		.update({_id: chatRoomId}, {$set: {usersList: newUsersList}})
		.then(updateResponse =>{
			res.status(200).json({
				message: "Chatroom has been removed"
			})
		})
		.catch(error =>{
			res.status(404).json({
				error: {
					message: error
				}
			})
		})
	})
	.catch(error =>{
		res.status(404).json({
			error: {
				message: error
			}
		})
	})
})

chatRoom.post("/lastReadDate", auth, (req, res, next) =>{
	const chatId = req.body.chatId;
	const userId = req.userInfo._id;
	ChatroomUser
		.find({userId: userId, chatId: chatId})
		.exec()
		.then(response => {
			if (response && response.length > 0 ){
				ChatroomUser
					.update(
						{userId: userId, chatId: chatId},
						{$set: {lastReadDate:Date.now()}})
					.then(response => {
						res.status(200).json({
							message: "complete"
						})
					})
			} else {
				const chatroomUser = new ChatroomUser({
					_id: new mongoose.Types.ObjectId(),
					userId: userId,
					chatId: chatId
				})
				chatroomUser.save()
					.then(response => {
						res.status(200).json({
							message: "complete"
						})
					})
			}
		})
		.catch(error =>{
			res.status(404).json({
				error: {
					message: error
				}
			})
		})
})

module.exports = chatRoom;
