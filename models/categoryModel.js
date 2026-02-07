const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName : {
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    slug : {
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    images : {
       type : Array,
       required : true
    },
    status :{
        type:String,
        default : "active",
        enum : ["active","inactive"]
    }
},{timestamps:true})


module.exports = mongoose.model('Category',categorySchema);