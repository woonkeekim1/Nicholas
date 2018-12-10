import Auth from "./Auth"
const UserRequest = {
  searchUserName:  function(username) {
    return fetch("http://localhost:3001/user/" + username, {
      headers: {
           "Content-Type": "application/json; charset=utf-8",
           "Authorization": "Bearer " + Auth.getToken()
         }
       })
    .then(response => response.json())
    .then(response => Promise.resolve(response))
  }
}
export default UserRequest
