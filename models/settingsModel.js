const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
   _id: {
    type: String,
    default: "GLOBAL_SETTINGS"
  },
  storeName : {
    type:String,
    required:true,
    trim:true
  },
  contactEmail : {
    type:String,
    required:true,
    trim:true
  },
  enableCOD : {
    type:Boolean,
    default:true
  },
  tax: {
     type:Number,
     min:0,
     default:0,
     validate:{
      validator: Number.isFinite,
      message: "Tax must be a valid number"
     }
  },
   shippingCharges:{
     type:Number,
     min:0,
     default:0,
     validate:{
      validator: Number.isFinite,
      message: "Shipping charges must be a valid number"
     }
   }
},{timestamps:true})    

module.exports = mongoose.model("settings",settingsSchema);