const express = require("express");
require('dotenv').config();
const authRoute = require("./routes/authRoute");
const app = express();
const cors = require('cors'); 
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const customerRoute = require("./routes/customerRoute");
const settingsRoute = require("./routes/settingsRoute");
require('./db/mongoDb')
const session = require("express-session");
const passport = require("./config/passport");


app.use(cors({
    origin : [ "https://buyify-frontend.vercel.app" ,"http://localhost:5173"],
    methods : ["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api',authRoute);
app.use('/api',categoryRoute);
app.use('/api',productRoute);
app.use('/api',cartRoute);
app.use('/api',paymentRoute);
app.use('/api',orderRoute);
app.use('/api',inventoryRoute);
app.use('/api',customerRoute);
app.use('/api',settingsRoute);

const port = process.env.PORT || 3000 ;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})
