/* eslint-disable no-console */
// DEPENDENCIES
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const server = require('http').createServer(app);
const config = require('./config');
const logger = require('./lib/log/index');

// LIB
const sendVendorsRequest = require('./lib/messaging/send/send-vendors-request');
const receiveVendorList = require('./lib/messaging/receive/receive-vendor-list');

switch (config.NODE_ENV) {
  case 'DEVELOPMENT_DOCKER':
  case 'DEVELOPMENT_LOCAL':
    logger.info(`Running ${config.NODE_ENV}`);
    // Log only on dev
    app.use(morgan('combined'));
    break;
  case 'TEST_DOCKER':
  case 'TEST_LOCAL':
    logger.info(`Running ${config.NODE_ENV}`);
    break;
  case 'PRODUCTION':
    logger.info(`Running ${config.NODE_ENV}`);
    break;
  default:
    logger.info(`No enviroment set, running ${config.NODE_ENV}`);
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
  logger.info(`Server on port ${app.get('port')}`);
  // Request new list of vendors for twitter to listen to
  sendVendorsRequest();
  // Listen for vendors list message
  receiveVendorList();
});

// For testing
module.exports = app;
