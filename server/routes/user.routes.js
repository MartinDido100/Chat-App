const { Router } = require('express');

const router = Router();

//Obtener usuario
router.get('/get/:username',getUser);

//Obtener Amigos
router.get('/:userId',getFriends);

router.post('/addFriend',addFriend);