const { model,Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const newMsgSchema = new Schema({
    friend:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    numberOfMsgs:{
        type: Number,
        default: 0
    }
})

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required:true,
        minlength: 10
    },
    password:{
        type: String,
        required: true
    },
    friends:[{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        default: []
    }],
    newMsgA:[{
        type: newMsgSchema,
        default: []
    }]
},{
    skipVersioning: true,
    timestamps: true,
    versionKey: false
})


userSchema.plugin(uniqueValidator,{message: 'El {PATH} ya fue tomado'});

module.exports = model('usuarios',userSchema)