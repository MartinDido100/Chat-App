const { Router } = require('express');
const { crearChat,obtenerChat,agregarMensaje,borrarChat } = require('../controllers/chat.controllers');


const router = Router();

//Crear chat
router.post('/newChat',crearChat);

//Obtener chat 
router.get('/get/chat/:miembro1/:miembro2',obtenerChat);

//Agregar un mensaje al chat
router.put('/putMessage',agregarMensaje);

router.delete('/borrarChat',borrarChat)

module.exports = router

