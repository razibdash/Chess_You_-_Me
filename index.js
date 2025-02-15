const express=require("express");
const http=require('http');
const  socket  = require("socket.io");
const {Chess}=require("chess.js");
const path=require('path');
const e = require("express");
const app=express();


const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();
let players={};
let currentPlayer='w';
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index');
});

io.on('connection',(socket)=>{
  console.log("connected!");

   if(!players.white){
     players.white=socket.id,
     socket.emit('playerRole','w');
   }
   else if(!players.black){
    players.black=socket.id;
    socket.emit('playerRole','b');
   }else{
    socket.emit('spectatorRole');
   }


   socket.on('disconnect',()=>{
     if(socket.id==players.white){
        delete players.white
     }else if((socket.id==players.black)){
        delete players.black
     }
   })

   //check valid moves or not
   socket.on('move',(move)=>{
    try {
        if(chess.turn()==='w' && socket.id!==players.white) return;
        if(chess.turn()==='b' && socket.id!==players.black) return;

      const result=  chess.move(move);
      if(result){
        currentPlayer=chess.turn();
        io.emit('move',move);
        io.emit('boardState',chess.fen())
      }else{
        console.log("something want wrong!");
        socket.emit('invalidMove',move);
      }
    } catch (error) {
        console.log(error);
        socket.emit('invalid move: ',move); 
    }
   })
})

server.listen(3000,()=>{
    console.log('server is running at port 3000');
})

