const mongoose = require('mongoose')

// shema design

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
    },
    email:{
        type:String,
        required:[true,"email is required and should be unique"],
    },
    password:{
        type:String,
        required:[true, "password is reuired"],
    },
},)

// export
const userModel = mongoose.model('users', userSchema)
module.exports = userModel;