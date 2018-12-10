import jwt from "jsonwebtoken"
const Auth = {
	logIn: function(username,password){
		return fetch('http://localhost:3001/user/login',{
			method: "POST",
			cache: "no-cache",
			headers: {
           	 "Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		})
		.then(response =>{
			return response.json()
		})
		.then(response =>{
			if (!response.error){
				localStorage.setItem("token", response.token)
			}else{
				alert("Invalid Username or Password")
			}
			return Promise.resolve(response)
		})
	},
	loggedIn:function(){
		const token = localStorage.getItem("token")
		const isLoggedIn = this.isExpiredToken(token)
		return isLoggedIn;
	},
	logOut: function(){
		localStorage.setItem("token", null)
	},
	getToken: function(){
		return localStorage.getItem('token')
	},
	isExpiredToken: function(token){
		const decoded = jwt.decode(token)
		return token && decoded && decoded.exp >= Date.now()/1000
	},
	register: function(username, password, confirmPassword, email){
		if(!username || !password || !confirmPassword || !email){
			return Promise.reject(new Error("All fields must be filled out!"))
		}else if(password != confirmPassword){
			return Promise.reject(new Error("Password does not match!"))
		}
		return fetch('http://localhost:3001/user/register',{
			method: "POST",
			cache: "no-cache",
			headers: {
           	 "Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({
				username: username,
				password: password,
				email: email
			})
		})
		.then(response =>{
			return response.json()
		}).then(response =>{
			if (!response.error){
				alert("User is created")
			}else{
				alert("Username is already taken!")
			}
		})
	},
	getUserId(){
		if(!this.loggedIn()) {
			return null;
		}
		const userInfo = jwt.decode(this.getToken());
		return userInfo._id
	},
	getUserName(){
		if(!this.loggedIn()) {
			return null;
		}
		const userInfo = jwt.decode(this.getToken());
		return userInfo.username
	}
}

export default Auth;
