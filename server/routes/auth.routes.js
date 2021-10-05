const { Router } = require('express');
const { validarJwt } = require('../middlewares/validarJwt');
const { registerUser,loginUser,verifyToken, googleLogin } = require('../controllers/auth.controllers');

const router = Router();

//Registrar usuario
router.post('/register',registerUser);

//Login usuario
router.post('/login',loginUser);

//Google login
router.post('/google',googleLogin);

//Verificar JWT
router.get('/verify',validarJwt,verifyToken);

module.exports = router;