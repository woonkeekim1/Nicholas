import React from "react";
import {Redirect} from "react-router-dom"
import Auth from "./Auth"
import "./Login.css"


export default class Login extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			username: "",
			password: "",
		}
	}

	onInputChange(e, target){
		const data = {}
		data[target] = e.target.value
		this.setState(data);
	}

	logIn(){
		Auth
		.logIn(this.state.username,this.state.password)
		.then(response =>{
			this.props.history.push('/chat')
		})
		.catch(error => {
		})
	}

	render() {
		return(
			<div className = "login-form-wrapper">
				<form className = "login-form">
					<div className = "row slide-input">
						<input
							type = "text"
							onChange = {(e) => this.onInputChange(e,"username")}
							required />
						<label>
							 USERNAME
						</label>
					</div>
					<div className = "row slide-input ">
						<input
							type = "password"
							onChange = {(e) => this.onInputChange(e,"password")}
							required />
						<label>
							PASSWORD
						</label>
					</div>
					<div className = "row slide-input">
						<input
							type = "button"
							value = "LOG IN"
							onClick = {(e) => this.logIn(e)}
						/>
					</div>
					<div className = "row-label">
						<label>
							<button onClick = {this.props.onChangeForm}>
								SIGN UP FOR AN ACCOUNT
							</button>
						</label>
					</div>
				</form>
			</div>
		)
	}
}
