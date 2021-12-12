const { Router } = require('express');
const { getUser,getFriends,addFriend,deleteFriend,getUsersList,updateNewMsgA, resetNewMsgA } = require('../controllers/user.controllers');

const router = Router();

//Obtener usuario
router.get('/get/:username',getUser);

//Obtener Amigos
router.get('/getFriends/:userId',getFriends);


//Buscar usuarios
router.get('/get/users/:query',getUsersList)

//Agregar amigo
router.put('/addFriend',addFriend);


//Eliminar amigo
router.put('/deleteFriend',deleteFriend);

//Actualizar nuevo mensaje cuando esta offline
router.put('/updateNewMsgA',updateNewMsgA);

//Resetear nuevo mensaje cuando esta offline
router.put('/resetNewMsgA',resetNewMsgA);

module.exports = router