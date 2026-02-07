const productModel = require('../models/productModel');

exports.getInventoryDetails = async (req,res)=>{
    if(req.role !== "admin"){
      return  res.status(403).json({success:false,message: "Access denied"})
    }
    try{
       const {search} = req.query;

        let query = {};
      if(search?.trim()){
        query = {
           $or : [
            {sku : {$regex: search.trim(), $options : "i"}},
            {productName : {$regex: search.trim(), $options : "i"}}
           ]
        }
      }
      const products = await productModel
      .find(query)
      .sort({createdAt : -1})

      return res.status(200).json({success:true,products})
    } catch (error) {
      return res.status(500).json({success:false,message:error.message})
    }
}

exports.updateInventoryStocks = async (req,res)=>{
    if(req.role !== "admin"){
      return  res.status(403).json({success:false,message: "Access denied"})
    }
    try {
      const {productId} = req.params;
      let {sizes} = req.body;
      const product = await productModel.findById(productId)
      if(!product){
        return res.status(400).json({success:false,message:"Product not found"})
      }

      if(typeof sizes === "string"){
        sizes = JSON.parse(sizes)
      }
    
      if(typeof sizes !== "object" || Array.isArray(sizes)){
        return res.status(400).json({success:false,message:"Sizes should be object"})
      }

      for (const key in sizes){
         if(sizes[key] < 0){
          return res.status(400).json({success:false,message:`${key} stock cannot be negative`})
        }
      }

      const normalizeSizesValue = (sizes)=>({
       XS : (Number(sizes.XS) || 0),
       S : (Number(sizes.S) || 0),
       M : (Number(sizes.M) || 0),
       L : (Number(sizes.L) || 0),
       XL : (Number(sizes.XL) || 0)
      })

      sizes = normalizeSizesValue(sizes)
      const totalStock = sizes.XS + sizes.S + sizes.M + sizes.L + sizes.XL;

      product.sizes = sizes;
      product.totalStock = totalStock
      await product.save()
      return res.status(200).json({success:true,message:"Inventory updated"})
    } catch (error) {
      return res.status(500).json({success:false,message:error.message})
    }
  }