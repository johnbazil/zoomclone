const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4 : uuidv4 } = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true 
})
app.set('view engine','ejs');
app.use(express.static('public'));  //create public url
app.use('/peerjs', peerServer )
app.get("/", ( req,res,next )=>{
    res.redirect(`/${uuidv4()}`);   //redirect to /:roomId by calling uuidv4 function
})

app.get('/:roomId', (req,res) => {
    res.render('room', { roomId : req.params.roomId })
})

io.on('connection', socket=>{      //create connection
    socket.on('join-room', (roomId, userId )=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId );
    })
})
server.listen(3000);
