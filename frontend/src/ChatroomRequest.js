import Auth from "./Auth"
const ChatroomRequest = {
  fetchAllChannels: function(){
    return fetch("http://localhost:3001/chatroom", {
			method: "GET",
			cache: "no-cache",
			headers: {
           	 "Content-Type": "application/json; charset=utf-8",
           	 "Authorization": "Bearer " + Auth.getToken()
			},
		})
		.then(response => {
			return response.json()
		})
    .then(response => Promise.resolve(response))
  },
  fetchTheChannel: function(id){
    return fetch("http://localhost:3001/chatroom/" + id, {
			method: "GET",
			cache: "no-cache",
			headers: {
           	 "Content-Type": "application/json; charset=utf-8",
           	 "Authorization": "Bearer " + Auth.getToken()
			},
		})
		.then(response => {
			return response.json()
		})
    .then(response => Promise.resolve(response))
  }
}

export default ChatroomRequest;
