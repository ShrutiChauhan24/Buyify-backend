const productModel = require("../models/productModel");

const decreaseStock = async (items,session)=>{
      for (const item of items){
         const result = await productModel.updateOne(
          {
           _id : item.product,
           [`sizes.${item.size}`] : {$gte : item.quantity}
         },{
            $inc : {
              [`sizes.${item.size}`]: -item.quantity,
               totalStock : -item.quantity
            }
         },{session})

         if(result.modifiedCount === 0){
            throw new Error("Insufficient stock")
         }
      }
}

module.exports = decreaseStock ;