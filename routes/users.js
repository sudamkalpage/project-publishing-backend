const express = require('express')
const Router = express.Router()
const User = require('../models/user')

// load profile image
Router.get('/', async(req,res)=>{
    console.log("sudam")
    res.send("sudam")
    
})

Router.get('/find/all', async(req,res)=>{
   try{
       const users = await User.find()
       res.json(users)
   }catch(err){
        res.send('Error: '+ err)
   }
})



module.exports = Router 