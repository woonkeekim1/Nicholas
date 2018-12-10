import React from "react";
import Auth from "./Auth"
import "./Login.css"


export default class Login extends React.Component{
	constructor(props){
		super(props)
		this.state = {username: "", password: "", confirmPassword: "", email:""}
	}
	onInputChange(e, target){
		const data = {}
		data[target] = e.target.value
		this.setState(data);
	}

	signup(){
		Auth
			.register(this.state.username,this.state.password, this.state.confirmPassword, this.state.email)
			.then(response =>{
				this.props.history.push('/chat')
			})
			.catch(error => {
				alert(error.message)
			})
	}
	render(){
		return(
			<div className = "login-form-wrapper">
				<form className = "login-form">
					<div className = "row slide-input">
						<input
							type = "text"
							onChange = {(e) => this.onInputChange(e, "username")}
							required />
						<label>
							 USERNAME
						</label>
					</div>
					<div className = "row slide-input">
						<input
							type = "password"
							onChange = {(e) => this.onInputChange(e, "password")}
							required />
						<label>
							PASSWORD
						</label>
					</div>
					<div className = "row slide-input">
						<input
							type = "password"
							onChange = {(e) => this.onInputChange(e, "confirmPassword")}
							required />
						<label>
							CONFIRM PASSWORD
						</label>
					</div>
					<div className = "row slide-input">
						<input
							type = "text"
							onChange = {(e) => this.onInputChange(e, "email")}
							required />
						<label>
							 EMAIL
						</label>
					</div>
					<div className = "row slide-input">
						<input type = "button" value = "SIGN UP" onClick = {this.signup.bind(this)}/>
					</div>
					<div className = "row-label">
						<label>
							<button  onClick = {this.props.onChangeForm}>
								HAVE AN ACCOUNT? SIGN IN
							</button>
						</label>
					</div>
				</form>
			</div>
		)

	}
}
