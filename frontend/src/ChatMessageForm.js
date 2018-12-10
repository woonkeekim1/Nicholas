import React from "react"
import "./ChatMessageForm.css"

export default class ChatMessageForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      message: ""
    }
  }

  keyUp(e) {
    if(e.key == 'Enter'){
      this.sendMessage()
      e.target.value = ""
    }
  }

  updateMessage(e){
    this.props.updateMessage(e.target.value)
  }

  sendMessage(){
    this.props.sendMessage()
    document.getElementById("message-textarea").focus()
  }

  render(){
    return(
      <div className = "message-message-wrapper">
        <div className = "message-message">
          <textarea
            id = "message-textarea"
            value = {this.props.message}
            onKeyUp = {(e) => this.keyUp(e)}
            onChange = {(e)=> this.updateMessage(e)}></textarea>
          <input type = "button" value = "Send" onClick = {(e)=> this.sendMessage()} />
        </div>
      </div>
    )
  }
}
