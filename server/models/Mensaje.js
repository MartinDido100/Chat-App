const { model,Schema } = require('mongoose');


const mensajeSchema = new Schema({
    contenido: {
        type: String,
        required: true
    },
    conversacion: {
        type: Schema.Types.ObjectId,
        ref: 'chats'
    },
    enviadoPor:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    recibidoPor:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }
},{
    timestamps: true,
    skipVersioning: true,
    versionKey:false
});


module.exports = model('mensajes',mensajeSchema);