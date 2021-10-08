const { response } = require('express');
const Chat = require('../models/Chat');



const crearChat = async (req,res = response) => {

    const  { miembro1, miembro2 } = req.body

    try {
        
        const dbChat = await Chat.findOne({ miembros: { $all : [ miembro1,miembro2 ] } })

        if(dbChat){
            return res.status(404).json({
                ok: false,
                msg:'Ya existe un chat entre estos 2'
            })
        }

        const newChat = new Chat({
            miembros: [miembro1,miembro2],
        })

        await newChat.save();

        return res.status(200).json({
            ok:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}

const obtenerChat = async (req,res = response) => {

    const { miembro1, miembro2 } = req.params

    try {
        
        const dbChat = await Chat.findOne({ miembros: { $all: [ miembro1,miembro2 ] } }) //TODO:HACER Populate de mensajes

        if(!dbChat){
            return res.status(404).json({
                ok: false,
                msg:'No se encontro el chat'
            })
        }

        return res.status(200).json({
            ok: true,
            mensajes: dbChat.messages,
            chatId: dbChat._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error de servidor'
        })
    }

}

const agregarMensaje = async (req,res = response) => {

    const { idMensaje, miembro1,miembro2 } = req.body;

    try {
        
        const dbChat = await Chat.findByIdAndUpdate({miembros: { $all: [miembro1,miembro2] }},{
            mensajes:{
                $push : {
                    idMensaje
                }
            }
        },{new:true})

        if(!dbChat){
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el chat'
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Agregado correctamente'
        })

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            ok: false,
            msg: 'Error de servido'
        })
    }

}

const borrarChat = async (req,res = response) => {

    const { miembro1,miembro2 } = req.body;

    try {
        
        const dbChat = await Chat.findOneAndRemove({miembros: { $all: [miembro1,miembro2] }})

        if(!dbChat){
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el chat'
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Borrado correctamente'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

module.exports = {
    crearChat,
    obtenerChat,
    agregarMensaje,
    borrarChat
}