import React from "react"
import {Switch, Route, Redirect} from "react-router-dom"
import Chat from "./Chat"
import Auth from "./Auth"
import PopupCreate from "./PopupCreate"
import ChatroomRequest from "./ChatroomRequest"
import ChatSocket from "./ChatSocket"
import Util from "./Util"
import Requests from "./Requests"
import "./ChatRouter.css"

export default class ChatRoute extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			directMessageList: {},
			channelList: {},
			showPopupCreate: false,
			isChannel: false,
			currChatRoomId: "",
		}
	}

	componentDidMount(){
		if(!Auth.loggedIn()){
			return <Redirect to = "/" />
		}

		this.refreshAllChannels()
	}

	recieveChatMessage(data){
		let newChannelList = Object.assign(this.state.channelList)
		let changed = 0
		if (newChannelList[data.sentTo]) {
			newChannelList[data.sentTo].count++;
			changed = 1
		}
		let newDirectMessageList = Object.assign(this.state.directMessageList)
		if (newDirectMessageList[data.sentTo]) {
			newDirectMessageList[data.sentTo].count++
			changed = 2
		}
		/*
		if (changed == 1){
			newChannelList.sort((item1,item2) => {
				return item2.lastModifiedDate - item1.lastModifiedDate
			})
		}else if(changed == 2){
			newDirectMessageList.sort((item1,item2) => {
				return item2.lastModifiedDate - item1.lastModifiedDate
			})
		}
		*/
		this.setState({
			directMessageList: newDirectMessageList,
			channelList: newChannelList
		})
	}

	refreshAllChannels(){
		ChatroomRequest.fetchAllChannels()
		.then(response =>{
			const directMessageList = response.chatroomList.filter(item => !item.isChannel)
			const channelList = response.chatroomList.filter(item => item.isChannel)
			this.setState({
				directMessageList: Util.addFieldToDictionary(Util.arrayToDictionary(directMessageList), "count", 0),
				channelList: Util.addFieldToDictionary(Util.arrayToDictionary(channelList), "count", 0)})
			ChatSocket.joinChatRooms(directMessageList, this.recieveChatMessage.bind(this))
			ChatSocket.joinChatRooms(channelList, this.recieveChatMessage.bind(this))
			directMessageList.forEach(item =>
				Requests.fetchUnreadCount(item._id, this.updateUnreadCount.bind(this), true))
			channelList.forEach(item =>
				Requests.fetchUnreadCount(item._id, this.updateUnreadCount.bind(this), false))
		})

	}

	updateUnreadCount(chatId, count, isDirectMessage) {
		if(isDirectMessage) {
			let directMessageList = Object.assign({}, this.state.directMessageList);
			directMessageList[chatId].count = count
			this.setState({
				directMessageList: directMessageList})
		}else {
			let channelList = Object.assign({}, this.state.channelList);
			channelList[chatId].count = count
			this.setState({
				channelList: channelList})
		}
	}

	changeToDateFormat(date){
		const month =
				date.getMonth() < 9 ?
				 "0" + (date.getMonth()+ 1)
				 : (date.getMonth()+ 1)

		const day = date.getDate() < 9 ?
		"0" + (date.getDate()+ 1)
		: (date.getDate() +1)

		return date.getFullYear() + "-" + month + "-" + day
	}

	onChannelClick(e, chatRoomId){
		console.log(chatRoomId)
		Requests.updateLastReadDate(chatRoomId)
		this.props.history.push("/chat/" + chatRoomId);
		window.location.reload();
	}

	renderChatChannel(){
		const channelList = Object.keys(this.state.channelList).map((item, index) => {
			const channel = this.state.channelList[item]
			console.log(channel)
			return(
				<div
					className = "chat-room"
					key = {index}
					onClick = {(e)=>this.onChannelClick(e, channel._id)}>
					<div className = "header-wrapper">
							<div className = "title">
									<div className = "room-name">
											# {channel.roomName} {channel.count != 0 ? <span>{channel.count}</span>: ""}
									</div>
							</div>
					</div>
				</div>
			)
		})

		return(
			<div className = "chat-list">
				<div className = "channels">
					Channels
					<div className = "add" onClick = {(e) => this.showPopupCreate(e, "Channels")}>
					+
					</div>
				</div>
				{channelList}
			</div>
		)
	}

	renderChatDirect(){

		const directMessageList = Object.keys(this.state.directMessageList).map((item, index) => {
			const channel = this.state.directMessageList[item]
			return(
				<div
					className = "chat-room"
					key = {index}
					onClick = {(e)=>this.onChannelClick(e, channel._id)}>
					<div className = "header-wrapper">
							<div className = "title">
									<div className = "room-name">
											# {channel.roomName} {channel.count != 0 ? <span>{channel.count}</span>: ""}
									</div>
							</div>
					</div>
				</div>
			)
		})

		return(
			<div className = "chat-list">
				<div className = "channels">
					Direct Message
					<div className = "add" onClick = {(e) => this.showPopupCreate(e, "Direct Messages")}>
						+
					</div>
				</div>
				{directMessageList}
			</div>
		)
	}

	showPopupCreate(e, popup){
		let isChannel = false
		if (popup == "Channels") {
			isChannel = true;
		} else {
			isChannel = false;
		}
		this.setState({isChannel: isChannel, showPopupCreate: true})
	}

	hidePopupCreate(){
		this.setState({showPopupCreate: false})
	}

	render(){
		if(!Auth.loggedIn()){
			this.props.history.replace("/")
			return(
				<div>
				</div>
			)
		} else{
			return(
				<div className = "chatroom">
					{
						this.state.showPopupCreate ?
							<PopupCreate
								hidePopup = {this.hidePopupCreate.bind(this)}
								isChannel = {this.state.isChannel}
								refreshAllChannels = {this.refreshAllChannels.bind(this)}
							/>
							: null
					}
					<div className = "left-nav">
						<div className = "name-holder">
							{Auth.getUserName()}
						</div>
						{this.renderChatChannel()}
						{this.renderChatDirect()}
					</div>
					<div className = "content">
						<Switch>
							<Route
								path = "/chat/:id"
								component = {
									(props) =>
										<Chat
											{...props}/>
								}
							/>
						</Switch>
					</div>
				</div>)
		}
	}
}
