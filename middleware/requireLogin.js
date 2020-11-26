const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = require("../schema/user");
module.exports = (req,res,next)=>{
    const token=req.cookies.token
    if(!token){
       //return res.status(401).json({error:"you must be logged in"})
       res.status(401)
       res.redirect('/');
    }
    
    
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         //return   res.status(401).json({error:"you must be logged in"})
         res.status(401)
         res.redirect('/');
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
    })
}