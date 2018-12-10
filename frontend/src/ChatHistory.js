import React from "react"
import "./ChatHistory.css"
import Auth from "./Auth"
import Util from "./Util"

export default class ChatHistory extends React.Component{
  constructor(props){
    super(props)
  }

  renderUsersImage(userId){
    const userInfo = this.props.usersList[userId]
    if(!userInfo){
      return;
    }
    if(userInfo && userInfo.profileImage){
      return(<img src = {userInfo.profileImage} />)
    }else{
      return(
        <p className = "initial">
          {userInfo.username.charAt(0).toUpperCase()}
        </p>
      )
    }
  }

  printDate(newDate) {
    return (
      <div className = "date">
        { newDate.toDateString() }
      </div>
    )
  }

  renderMessage(){
    const curUserId = Auth.getUserId()
    let curDate = new Date("1970-01-01")
    return this.props.messageList.map((item, index) =>{
      let newDate = Util.convertToDate(item.sentBy)
      let isNewDate = false;
      if (curDate.getTime() != newDate.getTime()) {
        curDate = newDate;
        isNewDate = true;
      }
      const className = "row" + (isNewDate ? " row-date" : "")
      return (
        <div key = {index} className = {className}>
          { isNewDate ? this.printDate(newDate) : null}
          <div className = {curUserId == item.sentFrom ? "self" : ""}>
              {this.renderUsersImage(item.sentFrom)}
              <p> {item.body} </p>
          </div>
        </div>
      )
    })
  }

  render(){
    return(
      <div className = "message-form">
  			<div className = "message-content" id = "chat-history">
          {this.renderMessage()}
  			</div>
  		</div>
    )

  }
}
