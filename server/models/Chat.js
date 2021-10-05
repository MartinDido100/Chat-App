const { model,Schema } = require('mongoose');


const chatSchema = new Schema({
    miembros: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        max: 2,
        min:1,
        required: true
    }],
    mensajes: [{
        type: Schema.Types.ObjectId,
        ref: 'mensajes'
    }]
});


module.exports = model('chats',chatSchema);