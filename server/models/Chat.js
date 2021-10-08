const { model,Schema } = require('mongoose');


const chatSchema = new Schema({
    miembros: [{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        max: 2,
        min:1,
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'mensajes',
        default: []
    }]
},{
    skipVersioning: true,
    timestamps: true,
    versionKey: false
});


module.exports = model('chats',chatSchema);