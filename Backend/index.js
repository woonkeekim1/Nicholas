const http = require('http');
const app = require('./app')
const port = 3001;

const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('connected')
  socket.on('SEND_MESSAGE', function(data){
    console.log('event')
    console.log(data)
    io.emit(data.sentTo, data)
  });
})
server.listen(port);
