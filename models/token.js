const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    refresh_token:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('Token',tokenSchema)