const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        default:null
    },
    password:{
        type:String,
        require:true,
        default:null
    },
    firstname:{
        type:String,
        require:false
    },
    lastname:{
        type:String,
        require:false
    },
    gender:{
        type:String,
        require:false
    },
    profilePicture:{
        type:String,
        require:false
    }
})

module.exports = mongoose.model('User',userSchema)