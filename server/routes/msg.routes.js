const { Router } = require('express');
const { crearMensaje,obetenerConver } = require('../controllers/msg.controllers');



const router = Router();


//Crear mensaje
router.post('/create',crearMensaje);

//Obtener mensajes de una coversacion
router.get('/get/conversation/:coverId',obetenerConver);


module.exports = router