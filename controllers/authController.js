const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const sendResetEmail = require('../utils/sendEmail');

exports.postSignup = async (req,res)=>{
 try {
    const {name,email,password} = req.body;
    const existingUser = await userModel.findOne({email});

    if(existingUser){
      return res.status(400).json({success:false,message:"User already exist"})
    }

    const hashPassword = await bcrypt.hash(password,10);
    const user = new userModel({
       name,
       email,
       password : hashPassword
    })
    await user.save();
   
    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
        expiresIn : "20d"
    })

    return res.status(200).json({
        success:true,
        message:"User signed up",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            authProvider:user.authProvider
        },
        token
    })

 } catch (error) {
    return res.status(500).json({success:false,message:error.message})
 }
}

exports.googleCallback = async (req,res)=>{
   try {
    if(!req.user){
       return res.redirect('http://localhost:5173/login')
    }
      
    const token = jwt.sign({id:req.user._id,role:req.user.role},process.env.JWT_SECRET,{expiresIn:"20d"})

    return res.redirect(`http://localhost:5173/auth-success?token=${token}`)
   } catch (error) {
    return res.status(500).json({success:false,message:error.message})
   }
}

exports.getUserMeGoogle = async (req,res)=>{
  try {
    if(!req.id){
      return res.status(400).json({success:false,message:"You are not a authenticate user"})
    }

    const user = await userModel.findById(req.id);
    if(!user){
      return res.status(400).json({success:false,message:'user not found'})
    }

    return res.status(200).json({success:true,user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            authProvider:user.authProvider
    }})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.postLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const existingUser = await userModel.findOne({email});
        if(!existingUser){
          return res.status(400).json({success:false,message:"User doesn't exist"})  
        }

        if(existingUser && existingUser.authProvider === "local"){
           const comparePassword = await bcrypt.compare(password,existingUser.password)
           if(!comparePassword){
             return res.status(400).json({success:false,message:"Incorrect password"})  
           }

           const token = jwt.sign({id:existingUser._id,role:existingUser.role},process.env.JWT_SECRET,{
            expiresIn : "20d"
         })

         return res.json({
        success:true,
         message: "user logged in",
        user:{
            id:existingUser._id,
            name:existingUser.name,
            email:existingUser.email,
            role:existingUser.role,
            authProvider:existingUser.authProvider
        },
        token})
        }

         if(existingUser && existingUser.authProvider === "google"){
           return res.status(400).json({success:false,message:"Please login with google"})
         }
    } catch (error) {
       return res.status(500).json({success:false,message:error.message})
    }
}

exports.postAdminSignup = async (req,res)=>{
  try {
    const {name,email,password,secretKey} = req.body;
    if(!name || !email || !password || !secretKey){
      return res.status(400).json({success:false,message:"All fields must be filled"})
    }
    const existingAdmin = await adminModel.findOne({email});
    if(existingAdmin){
      return res.status(400).json({success:false,message:"Admin already exist"})
    }

    if(secretKey !== process.env.ADMIN_SECRET_KEY){
       return res.status(400).json({success:false,message:"Incorrect Admin secret key"})
    }

    const hashPassword = await bcrypt.hash(password,10)
    const admin = new adminModel({
      name,email,password : hashPassword
    })
     await admin.save();


    return res.status(200).json({
        success:true,
        message:"Admin signed up,Please login",
    })

  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.postAdminLogin = async (req,res)=>{
  try {
    const {email,password,secretKey} = req.body;
    if(!email || !password || !secretKey){
      return res.status(400).json({success:false,message:"All fields must be filled"})
    }
    const existingAdmin = await adminModel.findOne({email});
    if(!existingAdmin){
      return res.status(400).json({success:false,message:"Admin doesn't exist"})
    }

    if(secretKey !== process.env.ADMIN_SECRET_KEY){
       return res.status(400).json({success:false,message:"Incorrect Admin secret key"})
    }

    const comparePassword = await bcrypt.compare(password,existingAdmin.password)
    if(!comparePassword){
       return res.status(400).json({success:false,message:"Incorrect Password"})
    }

     const token = jwt.sign({id:existingAdmin._id,role:existingAdmin.role},process.env.JWT_SECRET,{
        expiresIn : "20d"
    })

    return res.status(200).json({
        success:true,
        message:"Admin logged in",
        user:{
            id:existingAdmin._id,
            name:existingAdmin.name,
            email:existingAdmin.email,
            role:existingAdmin.role
        },
        token
    })

  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

exports.forgotPassword = async (req,res)=>{
   try {
     const {email} = req.body;
     const user = await userModel.findOne({email});
     if(!user){
      return res.json({message:"If user exists,Reset link sent"})
     }
     const token = crypto.randomBytes(32).toString("hex");

     user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
     user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

     await user.save()
     try {
      await sendResetEmail(user.email,token)
     } catch (error) {
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()
        throw error;
        //  throw new Error("Email could not be send")
     }
     return res.json({message:"If user exists,Reset link sent"})
   } catch (error) {
     return res.status(500).json({success:false,message:error.message})
   }
}

exports.resetPassword = async (req,res)=>{
  try {
    const {token} = req.params;
    const {password} = req.body;

    if(!password || password.length < 6){
      return res.status(400).json({success:false,message:"Password should have 6 characters"})
    }

    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetToken:hashToken,
      resetTokenExpiry: {$gt: Date.now()}
    })

    if(!user){
      return res.status(400).json({success:false,message:"Invalid or expired token"})
    }
 
    user.password = await bcrypt.hash(password,10);
    user.resetToken = null
    user.resetTokenExpiry = null

    await user.save();
    return res.status(200).json({success:true,message:"Password updated"})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}

