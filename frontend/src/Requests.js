import Auth from "./Auth"
const Request = {
 fetchInitialChatList: function(chatId){
    return fetch("http://localhost:3001/message/messages/" + chatId, {
      headers: {
             "Content-Type": "application/json; charset=utf-8",
             "Authorization": "Bearer " + Auth.getToken()
      },
    })
    .then(response => response.json())
    .then(response => {return Promise.resolve(response)} )
    .catch(err => console.log(err));
  },
  createChatroom: function(roomName, userList, isChannel){
    return fetch("http://localhost:3001/chatroom/", {
      method: "POST",
      headers: {
             "Content-Type": "application/json; charset=utf-8",
             "Authorization": "Bearer " + Auth.getToken()
      },
      body: JSON.stringify({
        roomName: roomName,
        usersList : userList,
        isChannel: isChannel
      })
    })
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response)
    })
    .catch(err => console.log(err));
  },
  sendMessage: function(chatRoomId, userName, body){
    return fetch("http://localhost:3001/message/"+chatRoomId,{
      method: "POST",
      headers: {
             "Content-Type": "application/json; charset=utf-8",
             "Authorization": "Bearer " + Auth.getToken()
      },
      body: JSON.stringify({
        body: body
      })
    })
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response)
    })
    .catch(err => console.log(err));
  },
  fetchUnreadCount: function(chatId, callBack, isDirectMessage){
    console.log(chatId)
    return fetch("http://localhost:3001/message/unreadCount", {
      method: "POST",
      headers: {
             "Content-Type": "application/json; charset=utf-8",
             "Authorization": "Bearer " + Auth.getToken()
      },
      body: JSON.stringify({
        chatId: chatId
      })
    })
    .then(response => response.json())
    .then(response => {
      callBack(chatId, response.count, isDirectMessage)
    })
    .catch(err => console.log(err));
  },
  updateLastReadDate: function(chatId){
    return fetch("http://localhost:3001/chatroom/lastReadDate", {
      method: "POST",
      headers: {
             "Content-Type": "application/json; charset=utf-8",
             "Authorization": "Bearer " + Auth.getToken()
      },
      body: JSON.stringify({
        chatId: chatId
      })
    })
    .then(response => response.json())
    .then(response => {
      return Promise.resolve(response)
    })
    .catch(err => console.log(err));
  }
}

export default Request
