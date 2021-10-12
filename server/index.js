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

const server = http.Server(app);

const io = require('socket.io')(server,{//Inicio el socket
    cors:{
        origins: ['http://localhost:4200'],
    }
});

io.on('connection',(socket)=> {
    console.log('User conected')
    socket.on('prueba',()=>{
        console.log("Llego la prueba");
    })
})
//Socket.Io Connection//




server.listen(PORT, () => {
    console.log(`>> Socket listo y escuchando por el puerto: ${PORT}`)
});

app.listen(3000,()=>{
    console.log(`Servidor iniciado en 3000`);
})