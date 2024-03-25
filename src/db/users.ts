const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    deleted:{
        type:Boolean,
        default:false
    }
})

export const UserModel = mongoose.model('User', userSchema)