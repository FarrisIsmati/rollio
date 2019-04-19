/* eslint-disable no-console */
// ENV
require('dotenv').config();

// DEPENDENCIES
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');

const server = http.createServer(app);

// ROUTES
const region = require('./lib/routes/region');
const vendor = require('./lib/routes/vendor');

// MESSAGES
const sendVendorTwitterIDs = require('./lib/messaging/send/send-vendor-twitterid');
const recieveVendorLocation = require('./lib/messaging/recieve/recieve-vendor-location');

switch (process.env.NODE_ENV) {
  case 'DEVELOPMENT':
    console.log('Running DEVELOPMENT');
    // Log only on dev
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

app.set('port', process.env.PORT || 3001);
if (process.env.NODE_ENV === 'PRODUCTION') { app.enable('trust proxy'); }// only if behind a reversed proxy (AWS is the goal)

// Fixed window rate limiting
const generalRateLimit = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15,
  handler(req, res) {
    res.status(429).send('You exceeded the rate limit');
  },
});

app.use(generalRateLimit);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/region', region);
app.use('/vendor', vendor);

server.listen(app.get('port'), () => {
  console.log(`You are flying on ${app.get('port')}`);
  // Send init vendor twitterIDs via RabbitMQ to Twitter Service
  if (process.env.NODE_ENV !== 'TEST') {
    sendVendorTwitterIDs();
    recieveVendorLocation.recieveTweets();
  }
});

// For testing
module.exports = app;
