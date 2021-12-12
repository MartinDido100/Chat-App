const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const dbConfig = require('./db/db.config');
const { json } = require('express');
require('dotenv').config();


//Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const msgRoutes = require('./routes/msg.routes')

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json())

dbConfig();

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/msg',msgRoutes);

//Socket.Io Connection//

let connectedUsers = [];

 const getUserToSend = friendId => {
     return connectedUsers.find(user => user.userId === friendId);
 }

const server = http.Server(app);

const io = require('socket.io')(server,{//Inicio el socket
    cors:{
        origins: ['http://localhost:4200'],
    }
});

io.on('connection',(socket)=> {
    console.log('User conected',socket.id);
    socket.on('login',({username,userId}) => {
        console.log('User logged',username);
        connectedUsers.push({
            username,
            userId,
            socketId: socket.id
        });
    });

    socket.on('logout',({userToLogout})=>{
        console.log('User unlogged',userToLogout.username);
        connectedUsers = connectedUsers.filter(user => user.userId !== userToLogout.userId);
    });

    socket.on('sendMessage',({message,friendId,sentFrom})=>{
        const userToSend = getUserToSend(friendId);
        if(userToSend !== undefined){
            io.to(userToSend.socketId).emit('messageReceived',{message,sentFrom});
        }else{
            io.to(socket.id).emit('messageReceivedOffline');
        }
    })

    socket.on('agregarAmigo',({friend,userToSend}) => {
        const userToSendSocket = getUserToSend(userToSend);
        if(userToSendSocket !== undefined){
            console.log('Agregando amigo',userToSend);
            io.to(userToSendSocket.socketId).emit('teAgregaron',{friend});
        }
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
        connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id);
    });
})
//Socket.Io Connection//




server.listen(PORT, () => {
    console.log(`>> Socket listo y escuchando por el puerto: ${PORT}`)
});

app.listen(3000,()=>{
    console.log(`Servidor iniciado en 3000`);
})