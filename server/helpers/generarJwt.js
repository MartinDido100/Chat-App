const jwt = require('jsonwebtoken');


const generarJwt = async (id,username) => {

    const payload = { id,username }

    return new Promise( (resolve,reject) => {

        jwt.sign(payload,process.env.JWT_SEED,{
            expiresIn: '3h'
        },(error,token) => {
            if(error){
                reject(error);
            }else{
                resolve(token)
            }
        });
    } )

}


module.exports = {
    generarJwt
}