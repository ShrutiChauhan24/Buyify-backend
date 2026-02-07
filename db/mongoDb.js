const mongoose = require('mongoose');

const url = process.env.MONGO_DB_URL ;

mongoose.connect(url)
.then(()=>console.log('db connected'))
.catch((err)=>console.log('error while dn connection',err))