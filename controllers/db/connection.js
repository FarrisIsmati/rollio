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
    case 'development':
        mongoose.connect("mongodb://localhost:27017/DCMOBILEVENDOR_DEV", options)
        .then(res=>console.log('Connected to DEV DB'))
        .catch(err=>console.log(err));
        break;
    case 'test':
        mongoose.connect("mongodb://localhost:27017/DCMOBILEVENDOR_TEST", options)
        .then(res=>console.log('Connected to TEST DB'))
        .catch(err=>console.log(err));
        break;
    case 'production':
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
