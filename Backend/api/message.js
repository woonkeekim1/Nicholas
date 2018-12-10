const express = require("express")
const messageRoute = express.Router()
const mongoose = require("mongoose")

const Message = require("../model/Message");
const Chatroom = require("../model/Chatroom");
const ChatroomUser = require("../model/ChatroomUser");
const auth = require("../middleware/auth");

messageRoute.post("/unreadCount", auth, (req, res, next) => {
	const chatId = req.body.chatId;
	const userId = req.userInfo._id;
	ChatroomUser
		.find({userId: userId, chatId: chatId})
		.exec()
		.then(response => {
			if (response && response.length > 0 ) {
				console.log(response[0].lastReadDate)
				console.log(chatId)
				console.log(userId)
				Message
					.find(
						{$and: [
							{sentTo: chatId},
							{sentBy: {$gte: response[0].lastReadDate}}
						]})
					.count()
					.exec()
					.then(response => {
						return res.status(200).json({
							count: response
						})
					})
			} else {
				console.log(chatId)
				console.log(userId)
				Message
					.find({sentTo: chatId})
					.count()
					.exec()
					.then(response => {
						return res.status(200).json({
							count: response
						})
					})
			}
		})
		.catch(error =>{
			console.log(error)
			return res.status(404).json({
				error: {
					message: error
				}
			})
		})
})

messageRoute.get("/messages/:id", auth, (req, res, next) => {
	const chatroomId = req.params.id
	const userId = req.userInfo._id
	Chatroom
	.find({
		_id: chatroomId,
		usersList: userId
	})
	.then(response => {
		if(!response || response.length == 0){
			res.status(404).json({
				error: {
					message: "User is not authorized"
				}
			})
		}

		Message
		.find({
			sentTo: chatroomId
		})
		.exec()
		.then(messageResponse => {
			res.status(200).json({
				messageList: messageResponse
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

messageRoute.post("/:id", auth, (req, res, next) => {
	if(!req.body.body && !req.body.picture){
		res.status(404).json({
			error: {
				message: "Message and Picture cannot be empty"
			}
		})
		return res;
	}

	const chatroomId = req.params.id
	const userId = req.userInfo._id
	Chatroom
	.find({
		_id: chatroomId,
		usersList: userId
	})
	.then(response => {
		if(!response || response.length == 0){
			res.status(404).json({
				error: {
					message: "User is not authorized"
				}
			})
		}

		const date = Date.now()

		const message = new Message({
			_id: new mongoose.Types.ObjectId(),
			sentFrom: userId,
			sentTo: chatroomId,
			body: req.body.body,
			sentBy: date
		})

		message
		.save()
		.then(messageResponse =>{
			res.status(200).json({
				message: "Message sent"
			})
			Chatroom
			.update({_id: chatroomId}, {$set: {lastMessage: req.body.body, lastModifiedDate: date}})
		})
		.catch(error =>{
			res.status(404).json({
				error: {
					message: error
				}
			})
		})
	})
	.catch(error => {
		res.status(404).json({
			error: {
				message: error
			}
		})
	})
})

module.exports = messageRoute
