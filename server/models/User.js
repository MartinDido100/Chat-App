const { model,Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
    }]
},{
    skipVersioning: true,
    timestamps: true,
    versionKey: false
})


userSchema.plugin(uniqueValidator,{message: 'El {PATH} ya fue tomado'});

module.exports = model('usuarios',userSchema)