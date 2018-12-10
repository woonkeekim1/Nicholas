import React from "react"
import Requests from "./Requests"
import ChatroomRequest from "./ChatroomRequest"
import UserRequest from "./UserRequest"
import Auth from "./Auth"
import "./PopupCreate.css"

export default class PopupCreate extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      chatroomName: "",
      userName: "",
      selectedUserList:{},
      searchedUserList:[]
    }
  }

  hidePopup(){
    this.props.hidePopup()
  }

  createChatroom(){
    let userList = Object
                    .keys(this.state.selectedUserList)
                    .map(id => this.state.selectedUserList[id]._id)
    if (!this.state.chatroomName || !userList || userList.length== 0){
      alert("You Must Enter Chatroom Name and Invite List");
      return;
    }
    if (!this.props.isChannel && userList.length > 1){
      alert("Direct Message can Only be with One person");
      return;
    }
    userList.push(Auth.getUserId());
    Requests
      .createChatroom(this.state.chatroomName, userList, this.props.isChannel)
      .then(this.props.refreshAllChannels())
      .catch(err => console.log(err));
    this.hidePopup()
  }

  changeChatroomName(e){
    const chatroomName = e.target.value;
    this.setState({chatroomName : chatroomName});
  }

  changeUserList(e){
    const userName = e.target.value;
    this.setState({userName : userName});
    if(userName.length > 0){
      UserRequest.searchUserName(userName)
      .then(searchedUserList => {
        if(searchedUserList && searchedUserList.length > 0){
          this.setState({searchedUserList: searchedUserList})
        } else{
          this.setState({searchedUserList: []})
        }
      })
    }
  }

  displaySelectedUser(){
    return Object.keys(this.state.selectedUserList).map((id, index) =>{
      const item = this.state.selectedUserList[id]
      return (
        <span key = {index}>
          {item.username}
        </span>
      )
    })
  }

  addToSelectedUserList(item){
    const selectedUserList = this.state.selectedUserList;
    selectedUserList[item._id] = item;
    this.setState({
      selectedUserList : selectedUserList,
      searchedUserList : [],
      userName: ""})
  }

  displaySearchedUser(){
    return this.state.searchedUserList.map((item, index) =>{
      return (
        <div key = {index} onClick = {(e) => this.addToSelectedUserList(item)}>
          {item.username}
        </div>
      )
    })
  }

  render() {
    return (
      <div className = "popup" onClick = {(e) => this.hidePopup()}>
        <div className = "popup-form" onClick = {(e) => e.stopPropagation()} >
          <div className = "row slide-input">
            <input
              type = "text"
              value = {this.state.chatroomName}
              required
              onChange = {(e) => this.changeChatroomName(e)}/>
            <label> CHATROOM NAME </label>
          </div>
          <div className = "row slide-input">
            <input
              type = "text"
              value = {this.state.userName}
              required
              onChange  = {(e) => this.changeUserList(e)} />
            <label> INVITE </label>
            <div className = "text-dropdown-list">
              {this.displaySearchedUser()}
            </div>
          </div>
          <div className = "row selected-user">
            {this.displaySelectedUser()}
          </div>
          <input
            type = "button"
            value = "CREATE"
            onClick = {() => this.createChatroom()}/>
        </div>
      </div>
    )
  }
}
