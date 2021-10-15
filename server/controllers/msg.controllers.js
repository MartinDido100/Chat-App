const { response } = require('express');
const Mensaje = require('../models/Mensaje');
const Chat = require('../models/Chat');


const crearMensaje = async (req,res=response) => {

    const { enviadoPor , recibidoPor, contenido, conversacion} = req.body

    try {
        
        const newMsg = new Mensaje(req.body);

        await newMsg.save();

        const conver = await Chat.findOneAndUpdate({_id: conversacion},{
            $addToSet:{
                messages: newMsg._id
            }
        });

        return res.status(200).json({
            ok: true,
            msg:'Guardado'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}

const obetenerConver = async (req,res=response) => {

    const { converId } = req.params;

    try {
        
        const messages = await Mensaje.find({ convesacion:{$eq: converId} });

        return res.status(200).json({
            ok:true,
            conver: messages
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
    crearMensaje,
    obetenerConver,
}