const socket = io();
socket.emit('hi','hello rajib');

socket.on('hello',(data)=>{
    console.log(data);
})