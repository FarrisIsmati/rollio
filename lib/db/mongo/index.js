//ENV
require('dotenv').config();

//DEPENDENCIES
const mongoose = require('mongoose');

const options = {
  autoIndex: false,
  useNewUrlParser: true
}

//SET DB ENVIROMENT
switch (process.env.NODE_ENV) {
  case 'DEVELOPMENT':
    mongoose.connect("mongodb://localhost:27017/DCMOBILEVENDOR_DEV", options)
    .then(res=>console.log('Connected to DEV DB'))
    .catch(err=>console.log(err));
    break;
  case 'TEST':
    mongoose.connect("mongodb://localhost:27017/DCMOBILEVENDOR_TEST", options)
    .catch(err=>console.log(err));
    break;
  case 'PRODUCTION':
    mongoose.connect(process.env.MLAB_URL, options)
    .then(res=>console.log('Connected to PRODUCTION DB'))
    .catch(err=>console.log(err));
    break;
  default:
    console.log('No DB enviroment set using DEVELOPMENT')
    mongoose.connect("mongodb://localhost:27017/DCMOBILEVENDOR_DEV", options)
    .then(res=>console.log('Connected to DEV DB'))
    .catch(err=>console.log(err));
}

module.exports = mongoose;
