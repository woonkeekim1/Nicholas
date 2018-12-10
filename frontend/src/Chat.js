import React from "react"
import ChatHistory from "./ChatHistory"
import ChatMessageForm from "./ChatMessageForm"
import Requests from "./Requests"
import ChatroomRequest from "./ChatroomRequest"
import Auth from "./Auth"
import Request from "./Requests"
import ChatSocket from "./ChatSocket"
import "./Chat.css"

export default class Chat extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			messageList: [],
			chatInfo: {},
			message: "",
			usersList: {},
			socket: ChatSocket.createSocket()
		}

	}

	loadChatHistory(parent){
		Requests
		.fetchInitialChatList(this.props.match.params.id)
		.then(response => {
			if (response) {
				this.setState({messageList: response.messageList})
			}
		})

		ChatroomRequest.fetchTheChannel(this.props.match.params.id)
		.then(response => {
			if (response.chatroomList && response.chatroomList.length == 1) {
				const chatInfo = response.chatroomList[0];
				 let usersList = {}
				 Object.keys(chatInfo.usersList).forEach(index => {
					 const userInfo = chatInfo.usersList[index]
					 usersList[userInfo._id]= userInfo
				 })
				this.setState({chatInfo: chatInfo, usersList: usersList})
				this.state.socket.on(chatInfo._id, message => this.updateNewMessage(message))
			}

		})
	}

	updateMessage(message){
    this.setState({message:message})
  }

	updateNewMessage(message){
		const newMessageList = this.state.messageList
		newMessageList.push(message)
		this.setState({messageList: newMessageList})
		if (message.sentFrom == Auth.getUserId()){
			var objDiv = document.getElementById("chat-history");
			objDiv.scrollTop = objDiv.scrollHeight;
			console.log("today")
		}
	}

	sendMessage(){
		if(this.state.chatInfo && Auth.getUserName() && this.state.message.trim() != ""){
			const data = {
				body:this.state.message,
				sentBy: new Date().toDateString(),
				sentFrom: Auth.getUserId(),
				sentTo: this.state.chatInfo._id,
			}
			this.state.socket.emit('SEND_MESSAGE', data)

			Request.sendMessage(this.state.chatInfo._id, Auth.getUserName(), this.state.message)
			.then(response => {
			})

		}

		this.setState({message: ""})
	}

	componentDidMount(){
		this.loadChatHistory(this)
	}

	render(){
		return(
			<div className = "content-wrapper">
				<div className = "chat-title-wrapper">
					<div className = "title">
						#{this.state.chatInfo.roomName}
					</div>
				</div>
				<div className = "chat-body-wrapper">
					<div>
						<ChatHistory
							messageList = {this.state.messageList}
							usersList = {this.state.usersList}/>
						<ChatMessageForm
							message = {this.state.message}
							updateMessage = {this.updateMessage.bind(this)}
							sendMessage = {this.sendMessage.bind(this)}
							/>
					</div>
				</div>
			</div>
		)
	}
}
