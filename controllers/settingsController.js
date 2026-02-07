const settingsModel = require("../models/settingsModel");

exports.addStoreInfo = async (req,res)=>{
    if(req.role !== "admin"){
     return res.status(401).json({success:false,message:"Access denied"})
   }
   try {
    const existingSetting = await settingsModel.findOne({_id:"GLOBAL_SETTINGS"});

    const VALID_FIELDS = [
        "storeName",
        "contactEmail",
        "enableCOD",
        "tax",
        "shippingCharges"
    ];

    if("enableCOD" in req.body && typeof req.body.enableCOD !== "boolean"){
         return res.status(400).json({success:false,message:"Enable cod should be in boolean value"})
    }

    

    let updateData = {};
    for (const field of VALID_FIELDS){
       if(field in req.body){
         updateData[field] = req.body[field]
       }
    }

    if(Object.keys(updateData).length === 0){
        return res.status(400).json({success:false,message:"No data provided for any update"})
    }

    if("tax" in updateData && typeof updateData.tax !== "number"){
        updateData.tax = Number(updateData.tax)
    }

     if("shippingCharges" in updateData && typeof updateData.shippingCharges !== "number"){
        updateData.shippingCharges = Number(updateData.shippingCharges)
    }

    if(!existingSetting){
        const requiredFields = ["storeName","contactEmail"];
        for(const field of requiredFields){
            if(!(field in updateData)){
              return res.status(400).json({success:false,message:"settings should need store name and contact email"})  
            }
        }
    }

    const settings = await settingsModel.findOneAndUpdate(
        {_id:"GLOBAL_SETTINGS"},
        {$set:updateData},
        {new:true,
         upsert:true,
         runValidators:true
        })
    return res.status(200).json({success:true,message:"settings updated"})
   } catch (error) {
     return res.status(500).json({success:false,message:error.message})
   }
}

exports.getSettingsInfo = async (req,res)=>{
   try {
      const settings = await settingsModel.findOne({_id:"GLOBAL_SETTINGS"});
       return res.status(200).json({success:true,settings})
   } catch (error) {
     return res.status(500).json({success:false,message:error.message})
   } 
}
