const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/userModel');
 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://buyify-backend.onrender.com/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) =>{
     try {
      const email = profile.emails[0].value;

      let user = await userModel.findOne({email});

      if(user && user.authProvider === "local"){
         return done(null,false)
      }

      if(!user){
         user = await userModel.create({
          name : profile.displayName ,
          email : email,
          googleId: profile.id,
          authProvider: "google"
         })
      }

      return done(null,user)
     } catch (err) {
        return done(err,null)
     }
  }
));

module.exports = passport;