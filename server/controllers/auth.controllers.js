const { response } = require("express");
const bcrypt = require('bcrypt');
const Usuario = require('../models/User');
const { generarJwt } = require('../helpers/generarJwt');


const registerUser = async (req,res = response) => {

    const { username, email, password } = req.body;

    try {
        
        const newUser = new Usuario(req.body);
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(password,salt);

        const token = await generarJwt(newUser._id,username);
        await newUser.save();

        return res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}

const loginUser = async(req,res = response) => {

    const { username, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ username });

        if(!dbUser){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe'
            });
        }

        const validPassword = bcrypt.compareSync(password,dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Error de credenciales'
            })
        }

        token = await generarJwt(dbUser._id,username);

        return res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

const googleLogin = async (req,res=response) => {

    const { username,email, password } = req.body;

    try {
        
        const existingUser = await Usuario.findOne({ email });

        if(!existingUser){

            const newUser = new Usuario(req.body);

            const token = await generarJwt(newUser._id,username);

            await newUser.save();

            return res.status(200).json({
                ok: true,
                token
            })

        }

        const token = await generarJwt(existingUser._id,username);

        return res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}


const verifyToken = async (req,res=response) => {

    const { username,_id } = req.body;

    const dbUser = await Usuario.findById(_id);

    const token = await generarJwt(dbUser._id,dbUser.name);

    return res.status(200).json({
        ok: true,
        username,
        userId: _id,
        email: dbUser.email,
        token
    })
}


module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    googleLogin
}