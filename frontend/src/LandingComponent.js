import React from 'react';
import Login from "./Login"
import Signup from "./Signup"
import Auth from "./Auth"

export default class LandingComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showLogin: true
    }
  }

  changeForm() {
    this.setState({showLogin: !this.state.showLogin})
  }

  renderImage(){
    return(
      <div className = "main-image">

      </div>
    )
  }

  renderLogInForm(){
    return(
      <div className="App">
        <div className = "left-form">
          {this.state.showLogin ?
            <Login onChangeForm = {this.changeForm.bind(this)} history = {this.props.history} />
            : <Signup onChangeForm = {this.changeForm.bind(this)}  history = {this.props.history}/>}
        </div>
        <div className = "right-form">
          {this.renderImage()}
        </div>
      </div>)
  }

  render(){
    if(Auth.loggedIn()) {
      this.props.history.replace("/chat")
    }
    return this.renderLogInForm();
  }
}
