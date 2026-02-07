const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
   user:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required : true
   },
   orderId : {
     type : String,
     required : true,
     unique: true
   },
   items : [
     {
        product : {
            type: mongoose.Schema.Types.ObjectId,
           ref: "Product",
           required : true},
        name : String,
        image: String,
        price: Number,
        quantity : Number,
        color: String,
        size : String   
     }
   ],
   shippingAddress : {
      fullName:String,
      email:String,
      phone:Number,
      addressLine:String,
      city:String,
      state:String,
      pincode:String,
      country:String
   },
  payment: {
    method:{
        type:String,
        enum : ["RAZORPAY","COD"],
         required:true
    },
    status:{
       type:String,
       enum : ["pending","paid"],
       default:"pending" 
    },
    razorpay:{
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
    }    
  },
  pricing:{
    subTotal : Number,
    tax:Number,
    shipping:Number,
    total:Number
  },
  orderStatus:{
       type:String,
       enum : ["placed","confirmed","shipped","out-for-delivery","delivered","cancelled"],
       default:"placed" 
  },
  trackingId:{
    type:String,
    default:null
  }
},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema);