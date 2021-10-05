const { model,Schema } = require('mongoose');


const mensajeSchema = new Schema({
    contenido: {
        type: String,
        required: true
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'chats'
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    reciver:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }
});


module.exports = model('mensajes',mensajeSchema);