const mongoose = require('mongoose');

const User = require('../models/user');

// fetch data of all user
exports.users_find_all =  async(req,res) => {
    await User.find()
        .exec().
        then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};
// fetch data of a specific user
exports.users_find_by_id =  async(req,res) => {
    await User.findById(req.params.id)
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs){
                res.status(200).json(docs);  
            }
            else{
                res.status(404).json({message: 'No valid User entry found for provided ID'});  
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};
// adding a new user
exports.users_add =  async(req,res) => {
    const new_user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })

    await new_user.save()
    .then( docs => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err); 
        res.status(500).json({error: err});
    }); 
};
// delete a user
exports.users_delete =  async(req,res) => {
    const id = req.params.id;
    await user.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({ message: 'successfully deleted' });
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
};
// update a user
exports.users_update =  async(req,res) => {
    try{
        const student = await Student.findById(req.params.id)
        console.log(student);
        student.username=req.body.username
        student.email=req.body.email
        student.password=req.body.password
        student.firstname=req.body.firstname
        student.lastname=req.body.lastname
        
        const updated_student = await student.save()
        console.log(updated_student);
        res.status(200).json({ message: 'successfully updated' });       
    }catch(err){
        console.log(err);
        res.status(500).json({error: err});
    }
};