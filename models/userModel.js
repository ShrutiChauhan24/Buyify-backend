const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
       type : String
    },
    googleId : {
       type : String
    },
    role:{
      type:String,
      default : "user",
      enum : ["user"]
    },
    authProvider : {
       type : String,
       default : "local",
       enum : ["local","google"]
    },
    resetToken: String,
    resetTokenExpiry : Date
},{timestamps : true})


module.exports = mongoose.model('User',userSchema);