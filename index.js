const express=require("express");
const http=require('http');
const  socket  = require("socket.io");
const {Chess}=require("chess.js");
const path=require('path');
const app=express();

const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();

app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index');
});

io.on('connection',(socket)=>{
  console.log("connected!");
  socket.on('hi',(data)=>{
    socket.emit('hello','hi client');
  })
})

server.listen(3000,()=>{
    console.log('server is running at port 3000');
})

