const orderModel = require('../models/orderModel');

exports.getAdminAllOrders = async (req,res)=>{
    if(req.role !== "admin"){
         return  res.status(401).json({success:false,message: "Access denied"})
      }
  try {
      const orders = await orderModel
      .find()
      .sort({createdAt : -1})

      return res.status(200).json({success:true,orders})

  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.adminViewOrderDetails = async (req,res)=>{
  if(req.role !== "admin"){
         return  res.status(401).json({success:false,message: "Access denied"})
      }
   try {
     const {orderId} = req.params;
     if(!orderId){
            return res.status(400).json({success:false,message:"order id should be provided"})
         }

     const order = await orderModel.findOne({orderId})
     if(!order){
        return res.status(400).json({success:false,message:"No order found"})
     }
     return res.status(200).json({success:true,order})
 } catch (error) {
     return res.status(500).json({success:false,message:error.message})
 }
}

exports.adminUpdateOrderStatus = async (req,res)=>{
   if(req.role !== "admin"){
         return  res.status(401).json({success:false,message: "Access denied"})
      }
      try {
       const {orderId} = req.params;
       const {orderStatus} = req.body;

       if(!orderId || !orderStatus){
            return res.status(400).json({success:false,message:"order id and new order status should be provided"})
         }

       let order = await orderModel.findOne({orderId})
        if(!order){
        return res.status(400).json({success:false,message:"No order found"})
       }

       const currentOrderStatus = order.orderStatus;
       const STATUS_FLOW = {
         placed : ["confirmed","cancelled"],  
         confirmed:["shipped","cancelled"],
         shipped: ["out-for-delivery"],
         "out-for-delivery":["delivered"],
         delivered:[],
         cancelled:[]
       }
       if(!STATUS_FLOW[currentOrderStatus].includes(orderStatus)){
           return res.status(400).json({success:false,message:"Invalid order status"})
       }
      
       if(orderStatus === "shipped" && !order.trackingId){
          return res.status(400).json({success:false,message:"Tracking id must be added before shipped"})
       }

       order.orderStatus = orderStatus
       await order.save();
       return res.status(200).json({success:true,message:"order status updated"})
      } catch (error) {
         return res.status(500).json({success:false,message:error.message})
      }
}

exports.adminAddTrackingId = async (req,res)=>{
     if(req.role !== "admin"){
         return  res.status(403).json({success:false,message: "Access denied"})
      }
      try {
         const {orderId} = req.params;
         const {trackingId} = req.body;

         if(!orderId){
          return res.status(400).json({success:false,message:"order id and tracking id should be provided"})
         }

         const trackingRegex = /^SHIP-\d{8}-[A-Z0-9]{5}$/ ;
         if(!trackingRegex.test(trackingId)){
          return res.status(400).json({success:false,message:"Invalid tracking id format"})
         }
         
         let order = await orderModel.findOne({orderId})
         if(!order){
        return res.status(400).json({success:false,message:"No order found"})
       }
        if(order.orderStatus !== "confirmed"){
          return res.status(400).json({success:false,message:"Tracking id only be added after order is confirmed"})
        }
       
        if(order.trackingId){
         return res.status(409).json({success:false,message:"Tracking id already exists"}) 
        }

        order.trackingId = trackingId;
        await order.save();
         return res.status(200).json({success:true,message:"Tracking id added successfully"})  
      } catch (error) {
        return res.status(500).json({success:false,message:error.message})
      }
}

exports.getMyOrders = async (req,res)=>{
   try {
      const userId = req.id;
      const orders = await orderModel
      .find({user:userId})
      .sort({createdAt:-1})

       return res.status(200).json({success:true,orders})
   } catch (error) {
     return res.status(500).json({success:false,message:error.message})
   }
}

exports.trackOrderDetails = async (req,res)=>{
   try {
      const {orderId} = req.params;
     if(!orderId){
            return res.status(400).json({success:false,message:"order id should be provided"})
         }

     const order = await orderModel.findOne({orderId})
     if(!order){
        return res.status(400).json({success:false,message:"No order found"})
     }
     return res.status(200).json({success:true,order})
 } catch (error) {
     return res.status(500).json({success:false,message:error.message})
 }
}