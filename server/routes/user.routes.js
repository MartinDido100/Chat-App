const { Router } = require('express');
const { getUser,getFriends,addFriend,deleteFriend } = require('../controllers/user.controllers');

const router = Router();

//Obtener usuario
router.get('/get/:username',getUser);

//Obtener Amigos
router.get('/getFriends/:userId',getFriends);

router.put('/addFriend',addFriend);

router.put('/deleteFriend',deleteFriend);


module.exports = router