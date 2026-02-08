const express = require("express");
const authRoute = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const verifyToken = require("../middleware/verifyToken");
authRoute.post('/auth/user/signup',authController.postSignup)
authRoute.post('/auth/user/login',authController.postLogin)

authRoute.post('/auth/admin/signup',authController.postAdminSignup)
authRoute.post('/auth/admin/login',authController.postAdminLogin)
authRoute.post('/forgot-password',authController.forgotPassword)
authRoute.post('/reset-password/:token',authController.resetPassword)

authRoute.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));
 
authRoute.get('/auth/google/callback', 
  passport.authenticate('google', {session:false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
  authController.googleCallback
 );

 authRoute.get('/get-user-me-google',verifyToken,authController.getUserMeGoogle);

module.exports = authRoute;