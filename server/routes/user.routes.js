const { Router } = require('express');

const router = Router();

//Obtener usuario
router.get('/:username',getUser);

//Obtener Amigos
router.get('/:userId',getFriends);