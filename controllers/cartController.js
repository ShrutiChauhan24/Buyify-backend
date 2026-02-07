const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");

exports.addToCart = async (req,res)=>{
  try {
    const userId = req.id;
    const {productId,selectedColor,selectedSize} = req.body;

    const product = await productModel.findById(productId);
    if(!product){
        return res.status(400).json({success:false,message:"Product not found"})
    }
    
    const maxSizeStock = product.sizes[selectedSize]
    if(!maxSizeStock || maxSizeStock === 0){
      return res.status(400).json({success:false,message:"Size out of stock"})
    }

    let cart = await cartModel.findOne({user:userId})
    if(!cart){
       cart = new cartModel({user:userId,items:[]})
    }
   
    const item = await cart.items.find(i=>
       i.productId.toString() === productId && 
       i.selectedColor === selectedColor &&
       i.selectedSize === selectedSize  
    )
    if(item){
        if(item.quantity >= maxSizeStock){
            return res.status(400).json({success:false,message:"maximum stock limit reached"})
        }
         item.quantity += 1
    }else{
        cart.items.push({
            productId:productId,
            quantity:1,
            price:product.price,
            selectedColor:selectedColor,
            selectedSize:selectedSize
        })
    }
    await cart.save();
    return res.status(200).json({success:true,message:"Product added to cart"})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.increaseQty = async (req,res)=>{
    try {
        const userId = req.id;
        const {productId,selectedColor,selectedSize} = req.body;
       
        const product = await productModel.findById(productId);
        if(!product){
          return res.status(400).json({success:false,message:"Product not found"}) 
        }
        
        const maxSizeStock = product.sizes[selectedSize]
        if(!maxSizeStock || maxSizeStock === 0){
            return res.status(400).json({success:false,message:"Size out of stock"}) 
        }
        let cart = await cartModel.findOne({user:userId})
        if(!cart){
          return res.status(400).json({success:false,message:"cart not found"})
        }

        const itemIndex = cart.items.findIndex(i=>
            i.productId.toString() === productId &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
        )

        if(itemIndex === -1) return res.json(cart)
    
        if(cart.items[itemIndex].quantity >= maxSizeStock){
          return res.status(400).json({success:false,message:"maximum stock limit reached"}) 
        }else{
            cart.items[itemIndex].quantity += 1
        }
        await cart.save();

         return res.status(200).json({success:true,message:"Quantity increased"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

exports.decreaseQty = async (req,res)=>{
    try {
      const userId = req.id;
      const {productId,selectedColor,selectedSize} = req.body;
      const product = await productModel.findById(productId);
        if(!product){
          return res.status(400).json({success:false,message:"Product not found"}) 
        }
        const maxSizeStock = product.sizes[selectedSize]
        if(!maxSizeStock || maxSizeStock === 0){
            return res.status(400).json({success:false,message:"Size out of stock"}) 
        }
         let cart = await cartModel.findOne({user:userId})
        if(!cart){
          return res.status(400).json({success:false,message:"cart not found"})
        }
        const itemIndex = cart.items.findIndex(i=>
          i.productId.toString() === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
        )
        if(itemIndex === -1) return res.json(cart)

        if(cart.items[itemIndex].quantity === 1){
           cart.items.splice(itemIndex,1) 
        }else{
            cart.items[itemIndex].quantity -= 1
        }
        await cart.save();
          return res.status(200).json({success:true,message:"Quantity decreased"})
    } catch (error) {
         return res.status(500).json({success:false,message:error.message})
    }
}

exports.removeItemFromCart = async (req,res)=>{
    try {
         const userId = req.id;
      const {productId,selectedColor,selectedSize} = req.body;

         let cart = await cartModel.findOne({user:userId})
        if(!cart){
          return res.status(400).json({success:false,message:"cart not found"})
        }

        const itemIndex = cart.items.findIndex(i=>
            i.productId.toString() === productId &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
        )
        if(itemIndex === -1) return res.json(cart)
         cart.items.splice(itemIndex,1) 
        await cart.save();
        return res.status(200).json({success:true,message:"Product removed from cart"})
    } catch (error) {
         return res.status(500).json({success:false,message:error.message})
    }
}

exports.getAllCartItems = async (req,res)=>{
    try {
        const userId = req.id;
        const cart = await cartModel
        .findOne({user:userId})
        .populate("items.productId")

        if(!cart){
          return res.status(200).json({
         success: true,
         cartItems: []
         });
        }
        return res.status(200).json({success:true,cartItems:cart.items})
    } catch (error) {
      return res.status(500).json({success:false,message:error.message})
    }
}


