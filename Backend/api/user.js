const express = require('express');
const user = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../model/User');
const auth = require("../middleware/auth");

user.post('/login', (req, res, next) => {
	console.log(req.body)
	User.find({username: req.body.username})
	.exec()
	.then(userResponse => {
		if(userResponse && userResponse.length == 1){
			bcrypt.compare(req.body.password, userResponse[0].password, function(err, result){
				if(err){
					res.status(404).json({
						message: 'Hash Failed'
					})
					return res;
				} else {
					if(result){
						const token = jwt.sign(
							{
								username: userResponse[0].username,
								_id: userResponse[0]._id,
								email: userResponse[0].email
							},
							process.env.JWT_SECRET_KEY,
							{
								expiresIn: '1h'
							}
						)
						res.status(200).json({
							message: 'You are logged in!',
							token: token
						})
					}else {
						res.status(404).json({
							error:{
								message: 'You are not authorized'
							}

						})
					}
				}
			})
		} else{
			res.status(404).json({
				error:{
					message: 'You are not authorized'
				}
			})
		}
	})
	.catch(error =>{
		res.status(404).json({
			error:{
				message: error
			}
		})
	})
})

user.post('/register', (req, res, next) => {
	bcrypt.hash(req.body.password, 10, function(err, hash){
		if (err) {
			res.status(404).json({
				message: 'Hash Failed'
			})
			return res;
		} else {
			User.find({$or: [{email: req.body.email}, {username: req.body.username}]})
			.exec()
			.then(userResponse =>{
				if (userResponse && userResponse.length > 0){
					res.status(404).json({
						error:{
							message:'This email or username has been taken'
						}
					})
				}else{
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						username: req.body.username,
						password: hash
					});
					user.save()
						.then(result => {
							res.status(200).json({
								message: 'You are registereds',
							})
						})
						.catch(err => {
							res.status(404).json({
								error:{
									message:err
								}
							})
						})
				}
			})
			.catch(err =>{
				res.status(404).json({
					error:{
						message:err
					}
				})
			})
		}
	})
})

user.get("/:username", auth, (req, res, next) => {
	User
		.find({
				username : {
					$regex : req.params.username,
					'$options' : 'i',
					$nin : [req.userInfo.username]},
	 })
		.select("username _id")
		.exec()
		.then(userResponse => {
			res.status(200).json(userResponse)
		})
		.catch(err =>{
			res.status(404).json({
				error:{
					message:err
				}
			})
		})
})

module.exports = user;
