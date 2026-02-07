const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

exports.getAllCustomers = async (req,res)=>{
    if(req.role !== "admin"){
      return  res.status(403).json({success:false,message: "Access denied"})
    }
    try {
        const customers = await userModel.aggregate([
          {
            $lookup : {
                from : "orders",
                localField : "_id",
                foreignField: "user",
                as : "orders"
            }
          },
          {
            $project:{
               name: 1,
               email:1,
               createdAt :1,
               totalOrders : {$size : "$orders"} 
            }
          }
        ])

        return res.status(200).json({success:true,customers})
    } catch (error) {
      return res.status(500).json({success:false,message:error.message}) 
    }
}

exports.getMetricsData = async (req,res)=>{
    if(req.role !== "admin"){
     return  res.status(403).json({success:false,message: "Access denied"}) 
    }
    try {
       let orders = await orderModel.find()

       const totalNoOfOrders = orders.length;
       const totalRevenue = await orders.reduce(
        (sum,order)=> sum + order.pricing.subTotal 
        ,0
    )
    const totalUsers = await userModel.countDocuments();
    const totalProductsListed = await productModel.countDocuments();
    const recentOrders = await orderModel
    .find()
    .sort({createdAt:-1})
    .populate("user" , "name")
    .limit(4)

    return res.status(200).json({success:true,
      metricsData : {
        totalNoOfOrders,
        totalRevenue,
        totalUsers,
        totalProductsListed,
        recentOrders
      }
    })
    }catch (error) {
     return res.status(500).json({success:false,message:error.message})   
    }
}