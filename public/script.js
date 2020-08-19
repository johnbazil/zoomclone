const socket = io('/')
const myVideo = document.createElement('video');    //create a video element
myVideo.muted = true
let myVideoStream;
var peer = new Peer(undefined, {
    path:'/peerjs',
    host:'/',
    port:'3000'
}); 

navigator.mediaDevices.getUserMedia({    //it is promise which gets video and audio
    video: true,
    audio: false
}).then((stream)=>{
    myVideoStream = stream              //get the stream and save in the myVideoStream variable
    addVideoStream(myVideo , stream)    
    peer.on('call', call => {           //if someone calls 
        call.answer(stream)             //Answer the call
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {     //new user connection
        connectToNewUser(userId,stream);
    })
})

peer.on('open', id =>{
    socket.emit('join-room', room_id, id)
})
socket.emit('join-room', room_id)



const connectToNewUser = (userId, stream) => {      //
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}



const addVideoStream = (video , stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    document.getElementById('video-grid').append(video)
}
