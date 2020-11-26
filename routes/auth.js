const User = require("../schema/user");
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post('/signup',(req,res)=>{
  console.log("inside signup post")
  console.log(req.body)
  const {username,email,password} = req.body 
  if(!email || !password || !username){
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"user already exists with that email"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                username
            })
    
            user.save()
            .then(user=>{
                res.redirect("/");
                console.log("user created successfully")
            })
            .catch(err=>{
                console.log(err)
            })
      })
     
  })
  .catch(err=>{
    console.log(err)
  })
})

router.get("/login", (req, res) => {
    res.render("login");
  });

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                console.log("successfully signed in")
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,username,email} = savedUser
               //res.json({token,user:{_id,name,email}})
               res.cookie('token',token, { httpOnly: true })
               global.user={_id,username,email}
               console.log(global.user)
               res.redirect("/posts");
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.get("/logout", (req, res) => {
  res.clearCookie('token')
  global.user=''
  console.log("user logged out")
  res.redirect('/');
 
});

module.exports = router
