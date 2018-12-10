const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const userRouter = require('./api/user')
const chatRoomRouter = require('./api/chatroom')
const messageRouter = require('./api/message')

mongoose.connect('mongodb://127.0.0.1:27017/Messenger');

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/chatroom', chatRoomRouter);
app.use('/message', messageRouter);

app.use('/', (req, res, next) =>{
	const error = new Error('Page Not Found');
	error.status = 404;
	next(error);
})

app.use('/', (error, req, res, next)=>{
	res.status(error.status || 404).json({
		message: error.message || 'Page Not Found'
	})
})

module.exports = app
