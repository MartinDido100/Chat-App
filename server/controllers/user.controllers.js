const { response,request } = require("express");
const Usuario = require('../models/User');

const getUser = async (req = request , res = response) =>{

    const { username } = req.params;

    try {

        const dbUser = await Usuario.findOne({username});
        
        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'No se encontro el usuario'
            })
        }

        return res.status(200).json({
            ok: true,
            username: dbUser.username,
            userId: dbUser._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}

const getUsersList = async (req,res=response) => {
    const { query } = req.params

    try {
        
        const usersList = await Usuario.find({});

        const filteredUsers = usersList.filter(user => {
            return user.username.toLowerCase().includes(query.toLowerCase())
        })

        const usersArray = filteredUsers.map(user => {
            return {
                userId: user._id,
                username: user.username,
                newMsgA: user.newMsgA
            }
        })

        return res.status(200).json({
            ok: true,
            usuarios: usersArray
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }
}

const getFriends = async (req, res = response) => {

    const { userId } = req.params;

    try {
        
        const dbUser = await Usuario.findById(userId).populate('friends')

        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'No se encontro el usuario'
            })
        }

        const friendsArray = dbUser.friends.map( friend => {
            return {
                userId: friend._id,
                username: friend.username,
                newMsgA: friend.newMsgA
            }
        })

        return res.status(200).json({
            ok: true,
            friends: friendsArray
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
        })
    }

}

const addFriend = async (req, res = response) => {

    const { userId, friendUsername } = req.body;

    try {
        
        const friend = await Usuario.findOne({username: friendUsername});

        if(!friend){
            return res.status(404).json({
                ok: false,
                msg:'Amigo no encontrado'
            })
        }


        const dbUser = await Usuario.findByIdAndUpdate(userId,{
            $addToSet: {
                friends: friend._id,
                newMsgA: {
                    friend: friend._id,
                    numberOfMsgs: 0
                }
            }
        },{new:true}).populate('friends');

        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no encontrado'
            })
        }

        await friend.updateOne({
            $addToSet:{
                friends: dbUser._id,
                newMsgA: {
                    friend: dbUser._id,
                    numberOfMsgs: 0
                }
            }
        })

        const friendsArray = dbUser.friends.map( friend => {
            return {
                userId: friend._id,
                username: friend.username,
                newMsgA: friend.newMsgA
            }
        })

        return res.status(200).json({
            ok: true,
            friends: friendsArray
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error de servidor'
        })
    }

}

const updateNewMsgA = async (req,res = response) => {

    const { userId,friendId } = req.body;

    try {
        
        const dbUser = await Usuario.findById(userId);

        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no encontrado'
            })
        }

        const index = dbUser.newMsgA.findIndex(friend => friend.friend == friendId);

        if(index === -1){
            return res.status(404).json({
                ok: false,
                msg:'Amigo no encontrado'
            })
        }

        dbUser.newMsgA[index].numberOfMsgs++;

        await dbUser.updateOne({
            newMsgA: dbUser.newMsgA
        });

        return res.status(200).json({
            ok: true,
            msg: 'Mensaje actualizado'
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error de servidor'
        })
    }

}

const resetNewMsgA = async (req,res = response) => {

    const { userId, friendId } = req.body;

    try {
        
        const dbUser = await Usuario.findById(userId);

        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no encontrado'
            })
        }

        const index = dbUser.newMsgA.findIndex(friend => friend.friend == friendId);

        if(index === -1){
            return res.status(404).json({
                ok: false,
                msg:'Amigo no encontrado'
            })
        }

        if(dbUser.newMsgA[index].numberOfMsgs === 0){
            return res.status(200).json({
                ok: true,
                msg:'No hay mensajes nuevos'
            })
        }

        dbUser.newMsgA[index].numberOfMsgs = 0;

        await dbUser.updateOne({
            newMsgA: dbUser.newMsgA
        });

        return res.status(200).json({
            ok: true,
            msg: 'Mensaje actualizado'
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error de servidor'
        })
    }

}

const deleteFriend = async (req,res = response) => {

    const { userId, friendUsername } = req.body;

    try {
        
        const friend = await Usuario.findOne({username: friendUsername});

        if(!friend){
            return res.status(404).json({
                ok: false,
                msg:'Amigo no encontrado'
            })
        }


        const dbUser = await Usuario.findByIdAndUpdate(userId,{
            $pull: {
                friends: friend._id,
                newMsgA: {
                    friend: friend._id
                }
            }
        },{new:true}).populate('friends');

        if(!dbUser){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no encontrado'
            })
        }

        await friend.updateOne({
            $pull:{
                friends: dbUser._id,
                newMsgA: {
                    friend: friend._id
                }
            }
        })

        const friendsArray = dbUser.friends.map( friend => {
            return {
                userId: friend._id,
                username: friend.username
            }
        })

        return res.status(200).json({
            ok: true,
            friends: friendsArray
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error de servidor'
        })
    }
}

module.exports = {
    getUser,
    getFriends,
    addFriend,
    getUsersList,
    deleteFriend,
    updateNewMsgA,
    resetNewMsgA
}