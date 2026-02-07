const categoryModel = require("../models/categoryModel");
const cloudinary = require("../cloudinary/cloudinary");

exports.addNewCategory = async (req,res)=>{
    if(req.role !== "admin"){
        return res.status(401).json({success:false,message:"Access denied"})
    }
 
    try {
        const {categoryName,slug,status} = req.body;
        const uploadedImages = [];

        for (const file of req.files){
            const result = await cloudinary.uploader.upload(file.path,{
                folder : "categories"
            })

             uploadedImages.push({
            url : result.secure_url,
            id: result.public_id
        })
      
        }
       

        if(!categoryName || !slug){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const existingCategory = await categoryModel.findOne({
            $or : [{categoryName} , {slug}]
        })
        if(existingCategory){
             return res.status(409).json({success:false,message:"category already exists"})
        }

        const category = await categoryModel.create({
            categoryName,slug,status,images:uploadedImages
        })

        return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }

}

exports.getAllCategories = async(req,res)=>{
    try {
        const {status} = req.query;
        
       if(status && !["active","inactive"].includes(status)){
           return res.status(400).json({success:false,message:"Invalid status value"}) 
       }

        let filter = {}
        if(status){
            filter.status = status
        }
        const categories = await categoryModel.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({success:true,categories})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

exports.deleteCategory = async (req,res)=>{
    if(req.role !== "admin"){
        return res.status(401).json({success:false,message:"Access denied"})
    }
    try {
        const {id} = req.params;
        
        const category = await categoryModel.findById(id);
        if(!category){
            return res.status(400).json({success:false,message:"Category not found"});
        }

        await categoryModel.findByIdAndDelete(id)
        return res.status(200).json({success:true,message:"Category deleted"});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

exports.updateCategory = async (req,res)=>{
    if(req.role !== "admin"){
        return res.status(401).json({success:false,message:"Access denied"})
    }
    try {
        const {id} = req.params;
        const {categoryName,slug,status} = req.body;
        if(!categoryName || !slug || !status){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const category = await categoryModel.findByIdAndUpdate(id,{categoryName,slug,status},{new:true})
        return res.status(200).json({success:true,message:"Category updated"})
    } catch (error) {
         return res.status(500).json({success:false,message:error.message})
    }
}