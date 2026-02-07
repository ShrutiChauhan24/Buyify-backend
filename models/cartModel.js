const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required:true,
    unique:true
  },
  items : [
    {
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        },
        quantity: Number,
        price : Number,
        selectedColor:String,
        selectedSize: String
    }
  ],
   updatedAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

module.exports = mongoose.model("Cart",cartSchema);

