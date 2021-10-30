const express = require('express')
const Router = express.Router()
const upload = require('../middleware/upload')
const jwt = require('jsonwebtoken')
const usersController =  require('../controllers/users');
let ACCESS_TOKEN_SECRET = '36386131b427d63b12369f8a4f10be7a35c62113efd8f2dd80aa53667e4d8e8a6f18bbb5bf82a256c7466f25dde22deab1a77047b7a8a69c074c0b261d89aac4'
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

Router.get('/find/all',usersController.users_find_all);

Router.get('/find/:id', authenticateToken, usersController.users_find_by_id);

Router.post('/signup',usersController.users_signup);

Router.delete('/delete/:id',usersController.users_delete);

Router.patch('/update/:id', authenticateToken, usersController.users_update);

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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json("Access token is required!")

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).json("Access token is expired!")
        req.user = user
        next()
    })
}

module.exports = Router 