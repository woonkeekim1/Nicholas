import io from "socket.io-client";

const ChatSocket = {
  createSocket: function(){
    return io('http://localhost:3001')
  },

  joinChatRooms: function(chatList, callBack){
    const socket = this.createSocket()
    if (chatList && chatList.length > 0){
      chatList.forEach((item) => socket.on(item._id, (data) => callBack(data)))
    }
  },
}

export default ChatSocket
