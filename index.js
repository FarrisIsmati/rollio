//ENV
require('dotenv').config();
//DEPENDENCIES
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const server = require('http').createServer(app);
//LIB
const recieveVendorList = require('./lib/messaging/recieve/recieve-vendor-list');

switch (process.env.NODE_ENV) {
    case 'DEVELOPMENT':
        console.log('Running DEVELOPMENT');
        //Log only on dev
        app.use(morgan('combined'));
        break;
    case 'TEST':
        console.log('Running TEST');
        break;
    case 'PRODUCTION':
        console.log('Running PRODUCTION');
        break;
    default:
        console.log('No enviroment set using DEVELOPMENT');
}

app.set('port', process.env.PORT || 3002);

if (process.env.NODE_ENV === 'PRODUCTION') {
  app.enable("trust proxy");
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

recieveVendorList();
// FOR TESTING
// const twitter = require('./lib/twitter/index');
// twitter.test();

server.listen(app.get('port'), () => {
  console.log('You are flying on ' + app.get('port'));
})

//For testing
module.exports = app;
