const mongoose = require('mongoose');



const dbConfig = async () =>{

    try {
        
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Mongo Iniciado');
    } catch (error) {
        console.log(error);
        throw new Error('Error de DB') 
    }

}


module.exports = dbConfig;