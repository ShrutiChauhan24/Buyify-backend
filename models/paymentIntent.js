const mongoose = require("mongoose");

const paymentIntentSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    pricing:{
    subTotal : Number,
    tax:Number,
    shipping:Number,
    total:Number
    },
    items: [
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
    user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required : true
       }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentIntent", paymentIntentSchema);
