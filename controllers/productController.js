const mongoose  = require('mongoose');
const cloudinary = require('../cloudinary/cloudinary');
const productModel = require('../models/productModel');


exports.addProduct = async (req, res) => {
 if(req.role !== "admin"){
  return res.status(401).json({success:false,message:"Access denied"})
 }
 try {
    let {
     productName,
     productDesc,
     price,
     discount,
     sku,
     gender,
     status,
     category,
     totalStock,
     sizes,
     colors
    } = req.body;

    price = Number(price)
    discount = Number(discount) || 0
    totalStock = Number(totalStock)

    colors = JSON.parse(colors);
    sizes = JSON.parse(sizes);
  
    if(!productName || !productDesc || !gender || !status || !category || !sku){
      return res.status(400).json({success:false,message:"All fields are required"})
    }

    if(price === undefined || price === null || price <= 0){
      return res.status(400).json({success:false,message:"Enter relevant price"})
    }
    
    if(totalStock === undefined|| totalStock === null || totalStock <= 0){
      return res.status(400).json({success:false,message:"Incorrect stock values"})
    }

    if(!Array.isArray(colors) || colors.length === 0){
      return res.status(400).json({success:false,message:"Select at least 1 color"})
    }

    const uploadedImages = [];
    for (const file of req.files){
      const result = await cloudinary.uploader.upload(file.path,{
        folder : "products"
      })

      uploadedImages.push(result.secure_url)
    }

    const product = new productModel({
      productName,
      productDesc,
      price,
      sku,
      discount,
      sizes,
      colors,
      category,
      totalStock,
      status,
      gender,
      images : uploadedImages
    })

  await product.save()

  return res.status(200).json({success:true,message:"Product added"})

 } catch (error) {
   return res.status(500).json({ success: false, message: error.message});
 }
};


exports.getAdminAllProducts = async (req,res)=>{
     if (req.role !== "admin") {
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
     const allProducts = await productModel
     .find()
     .sort({createdAt:-1})
     .populate({
      path : "category",
      select : "categoryName"
     })
     return res.status(200).json({success:true,allProducts})
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message});
  }
}

exports.getAdminProductById = async (req,res)=>{
   if (req.role !== "admin") {
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
    const {id} = req.params;
    const product = await productModel.findById(id);
    if(!product){
       return res.status(404).json({ success: false, message: "Product not found"});
    }
    return res.status(200).json({success:true,product})
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message});
  }
}

exports.getProductsList = async (req,res)=>{
   try {
     const {category,gender,status,search,limit} = req.query;
     let query = {};

     if(category && category !== "all"){
      if(mongoose.Types.ObjectId.isValid(category)){
         query.category = category
      }
     }
     if(gender && ["men","women","unisex"].includes(gender)){
        query.gender = gender
     }
     if(status && ["active","draft"].includes(status)){
       query.status = status
     }
     if(search && search.trim() !== ""){
      query.productName = {$regex : search ,$options : "i"}
     }

     let filteredProducts = productModel
     .find(query)
     .sort({createdAt : -1})
     .populate({
      path : "category",
      select : "categoryName"
     })

     if(limit && !isNaN(limit)){
       filteredProducts = filteredProducts.limit(Number(limit))
     }

     const products = await filteredProducts;

     return res.status(200).json({success:true,products})
   } catch (error) {
     return res.status(500).json({ success: false, message: error.message});
   }
}

exports.getProductById = async (req,res)=>{
  try {
    const {id} = req.params;
    const product = await productModel
    .findById(id)
    .populate("category" , "categoryName")
    ;
    if(!product){
       return res.status(404).json({ success: false, message: "Product not found"});
    }
    return res.status(200).json({success:true,product})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.addNewColor = async (req,res)=>{
  if(req.role !== "admin"){
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
    const {id} = req.params;
    const {color} = req.body;

    let product = await productModel.findById(id)

    if(!product){
      return res.status(404).json({success:false,message:"Product not found"})
    }

   if(!color || !color.trim()){
     return res.status(400).json({success:false,message:"Color is required"})
   }

    const cleanedColor = color.trim().toLowerCase();

    const alreadyExists = product.colors.some(
      (c)=> c.toLowerCase() === cleanedColor)

      if(alreadyExists){
        return res.status(400).json({success:false,message:"Color already exists"})
      }

     const formatColor = cleanedColor.charAt(0).toUpperCase() + cleanedColor.slice(1);
     product.colors.push(formatColor)
   await product.save()
    return res.status(200).json({success:true,message:"Color added"})
  } catch (error) {
     return res.status(500).json({success:false,message:error.message})
  }
}

exports.removeColor = async (req,res)=>{
  if(req.role !== "admin"){
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
     const {id} = req.params;
     const {color} = req.body;

     if(!color || !color.trim()){
       return res.status(400).json({success:false,message:"For removing the color,color is required"})
     }

     let product = await productModel.findById(id);
     if(!product){
      return res.status(404).json({success:false,message:"Product not found"})
     }

     if(product.colors.length === 1){
        return res.status(400).json({success:false,message:"Product should have atleast one color"})
     }

     const cleanedColor = color.trim().toLowerCase();

    const exists = product.colors.some(
    (c)=> c.toLowerCase() === cleanedColor)

       if(!exists){
        return res.status(400).json({success:false,message:"Color not exist"})
       }

     product.colors = product.colors.filter(
      (c)=>c.toLowerCase() !== cleanedColor)

     await product.save();
     return res.status(200).json({success:true,message:"Color removed"})
  } catch (error) {
     return res.status(500).json({success:false,message:error.message})
  }
}

exports.updateProduct = async (req,res)=>{
  if(req.role !== "admin"){
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
    const {id} = req.params;
    let {productName,productDesc,price,discount} = req.body;

     let product = await productModel.findById(id)
     if(!product){
        return res.status(404).json({ success: false, message: "Product not found"});
     }

    price = Number(price)
    discount = Number(discount) || 0
    
    if(!productName || !productName.trim()){
       return res.status(400).json({success:false,message:"Product name is required"})
    }

    if(!productDesc || !productDesc.trim()){
       return res.status(400).json({success:false,message:"Product description is required"})
    }

    if(price === undefined || price <= 0 || isNaN(price)){
       return res.status(400).json({success:false,message:"Invalid price amount"})
    }
    if(discount > 100 || discount < 0 || isNaN(discount)){
       return res.status(400).json({success:false,message:"Invalid discount amount"})
    }

    product.productName = productName.trim()
    product.productDesc = productDesc.trim()
    product.price = price
    product.discount = discount
    await product.save()
    return res.status(200).json({success:true,message:"Product updated"})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.deleteProduct = async (req,res)=>{
   if(req.role !== "admin"){
    return res.status(401).json({ success: false, message: "Access denied"});
  }
  try {
    const {id} = req.params;
    await productModel.findByIdAndDelete(id)
    return res.status(200).json({success:true,message:"Product deleted"})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}