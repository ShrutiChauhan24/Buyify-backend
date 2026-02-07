const productModel = require("../models/productModel");
const settingsModel = require("../models/settingsModel");


const calculateOrderAmount = async (items)=>{
   let subTotal = 0;
   
   for (const item of items){
      const product = await productModel.findById(item.product);

      if(!product){
        throw new Error("product not found")
      }

      if(product.status !== "active"){
        throw new Error(`${product.productName} is currently unavailable`);
      }

      if(!product.sizes[item.size]){
        throw new Error(`Invalid size selected : ${item.size}`)
      }

      if(item.quantity > product.sizes[item.size]){
        throw new Error(`Only ${product.sizes[item.size]} items left for size ${item.size}`)
      }
       
      if(!product.colors.includes(item.color)){
         throw new Error(`${item.color} is no longer available in ${product.productName}`)
      }

      const discountedPrice = Math.round(product.price - (product.price * product.discount / 100))
      subTotal += discountedPrice * item.quantity

   }

    const settings = await settingsModel.findOne({_id:"GLOBAL_SETTINGS"});
    const taxPercent = settings?.tax || 0;
    const shippingCharge = settings?.shippingCharges || 0;


      const tax = Math.round(subTotal * taxPercent / 100)
      const shipping = subTotal > 3000 ? 0 : shippingCharge
      const total = subTotal + tax + shipping;

      return {subTotal,tax,shipping,total}
}

module.exports = calculateOrderAmount;