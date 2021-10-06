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
            _id: dbUser._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Error de servidor'
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
                _id: friend._id,
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
                friends: friend._id
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
                friends: dbUser._id
            }
        })

        const friendsArray = dbUser.friends.map( friend => {
            return {
                _id: friend._id,
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
                friends: friend._id
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
                friends: dbUser._id
            }
        })

        const friendsArray = dbUser.friends.map( friend => {
            return {
                _id: friend._id,
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
    deleteFriend
}