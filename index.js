// DEPENDENCIES
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const server = require('http').createServer(app);
const config = require('./config');

// LIB
const sendVendorsRequest = require('./lib/messaging/send/send-vendors-request');
const recieveVendorList = require('./lib/messaging/recieve/recieve-vendor-list');

switch (config.NODE_ENV) {
  case 'DEVELOPMENT_DOCKER':
  case 'DEVELOPMENT_LOCAL':
    console.log(`Running ${config.NODE_ENV}`);
    // Log only on dev
    app.use(morgan('combined'));
    break;
  case 'TEST_DOCKER':
  case 'TEST_LOCAL':
    console.log(`Running ${config.NODE_ENV}`);
    break;
  case 'PRODUCTION':
    console.log(`Running ${config.NODE_ENV}`);
    break;
  default:
    console.log(`No enviroment set using ${config.NODE_ENV}`);
}

app.set('port', config.PORT || 3002);

if (config.NODE_ENV === 'PRODUCTION') {
  app.enable('trust proxy');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// // FOR TESTING ~~~
// // eslint-disable-next-line import/newline-after-import
// const twitter = require('./lib/twitter/index');
// twitter.test();
// // FOR TESTING ~~~

server.listen(app.get('port'), () => {
  console.log(`You are flying on ${app.get('port')}`);
  // Request new list of vendors for twitter to listen to
  sendVendorsRequest();
  // Listen for vendors list message
  recieveVendorList();
});

// For testing
module.exports = app;
