/* eslint-disable no-console */
// DEPENDENCIES
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');
const config = require('./config');
const seed = require('./lib/db/mongo/seeds/dev-seed');
const logger = require('./lib/log/index');

const server = http.createServer(app);

// ROUTES
const region = require('./lib/routes/region');
const vendor = require('./lib/routes/vendor');

// MESSAGES
const receiveVendorsRequest = require('./lib/messaging/receive/receive-vendors-request');
const receiveVendorLocation = require('./lib/messaging/receive/receive-vendor-location');

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
    console.log(`No enviroment set, running ${config.NODE_ENV}`);
}

app.set('port', config.PORT || 3001);
if (config.NODE_ENV === 'PRODUCTION') { app.enable('trust proxy'); }// only if behind a reversed proxy (AWS is the goal)

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

server.listen(app.get('port'), async () => {
  logger.info(`Server on port ${app.get('port')}`);

  // Seed the docker db (Only for docker testing purposes now, delete when proper db env setup)
  if (config.NODE_ENV === 'DEVELOPMENT_DOCKER') {
    await seed.runSeed();
  }

  // Send init vendor twitterIDs via RabbitMQ to Twitter Service
  if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') {
    receiveVendorsRequest();
    receiveVendorLocation.receiveTweets();
  }
});

// For testing
module.exports = app;
