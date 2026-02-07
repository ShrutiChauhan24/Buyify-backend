const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
   productName: {
    type:String,
    required:true,
    trim:true
   },
   productDesc: {
    type:String,
    required:true
   },
   price: {
    type:Number,
    required:true,
    set: (v) => Number(v),
    min : 0,
    validate: {
    validator: Number.isFinite,
    message: "price must be a valid number"
  }
   },
   discount: {
    type:Number,
    default:0,
    min:0,
    max:100,
    set: (v) => Number(v)
   },
   sku : {
     type:String,
     required:true,
     unique:true,
     uppercase:true,
     trim:true
   },
   gender:{
    type:String,
    enum:["men","women","unisex"],
    default : "unisex"
   },
   category:{
     type:mongoose.Schema.Types.ObjectId,
      ref : "Category"
   },
   colors:{
    type:[String],
    required:true
   },
   images:{
    type:[String],
    required:true
   },
   sizes:{
     XS: {
      type:Number,
      default:0,
      min:0,
      validate:Number.isFinite
   },
   S: {
      type:Number,
      default:0,
      min:0,
      validate:Number.isFinite
   },
   M: {
      type:Number,
      default:0,
      min:0,
      validate:Number.isFinite
   },
   L: {
      type:Number,
      default:0,
      min:0,
      validate:Number.isFinite
   },
   XL: {
      type:Number,
      default:0,
      min:0,
      validate:Number.isFinite
   }
   },
   totalStock:{
      type : Number,
      required : true,
      min : 0,
      set: (v) => Number(v),
      validate: {
      validator: Number.isFinite,
      message: "totalStock must be a valid number"
   }
},
   status:{
    type:String,
    default:"active",
    enum:["active","draft"]
   }
},{timestamps:true})

productSchema.pre("save", function(){
   const sizes = this.sizes || {} ; 
   const calculatedStock = 
   (sizes.XS || 0) + 
   (sizes.S || 0) + 
   (sizes.M || 0) + 
   (sizes.L || 0) + 
   (sizes.XL || 0) ;  

   if(calculatedStock !== this.totalStock){
    throw new Error("Total stock doesn't match the sizes stock");
   }
  
})

module.exports = mongoose.model('Product',productSchema);