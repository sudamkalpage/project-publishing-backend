const express = require('express')
const Router = express.Router()
const User = require('../models/user')
const upload = require('../middleware/upload')
const usersController =  require('../controllers/users');

const uploadMultiple = upload.fields([
    { 
        name: 'profile_picture', 
        maxCount: 1 
    }
]);

// load profile image
Router.get('/', async(req,res)=>{
    res.send("User Hme page")  
})

// Router.get('/find/all', async(req,res)=>{
//    try{
//        const users = await User.find()
//        res.json(users)
//    }catch(err){
//         res.send('Error: '+ err)
//    }
// })

Router.get('/find/all',usersController.users_find_all);

Router.get('/find/:id',usersController.users_find_by_id);

Router.post('/add',usersController.users_add);

Router.delete('/delete/:id',usersController.users_delete);

Router.patch('/update/:id',usersController.users_update);

//--------------------------------------------------------------------------------------
// uploading profile image
Router.post('/img/:id',uploadMultiple, async(req,res)=>{
    console.log(req.files)
    console.log(req.body)
    try{
        const student = await Student.findById(req.params.id)
        let path = req.files.profile_picture[0].path
        student.profilePicture = req.files.profile_picture[0].path;
        const updated_student = await student.save()
        console.log(updated_student);
        res.status(200).json({ message: 'successfully uploaded' });
    }catch(err){
        console.log(err);
        res.status(500).json({error: err});
    }
})
// load profile image
Router.get('/img/:id', async(req,res)=>{
    let path = __dirname.substring(0,52)
    // console.log(path)
    try{
        const student = await Student.findById(req.params.id)
        path += student.profilePicture
        console.log(path)
        res.status(200).sendFile(path);     
    }catch(err){
        console.log(err);
        res.status(500).json({error: err});
    }
    
})

module.exports = Router 