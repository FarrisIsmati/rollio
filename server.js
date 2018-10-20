//ENV
require('dotenv').config();

//DEPENDENCIES
const app             = require('express')();
      app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const bodyParser      = require('body-parser');
const morgan          = require('morgan');
const cors            = require('cors');
const socketIO        = require('socket.io');
const rateLimit       = require('express-rate-limit');
const http            = require('http');
const server          = require('http').createServer(app);

//TESTING
const TwitterClient   = require('./controllers/live/twitter/TwitterClient');

//ROUTES
const region          = require('./controllers/routes/region');
const vendor          = require('./controllers/routes/vendor');

//SET LOGGER
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


//APP
app.set('port', process.env.PORT || 3001);
if (process.env.NODE_ENV === 'PRODUCTION')
  app.enable("trust proxy");// only if behind a reversed proxy (AWS is the goal)

//FIXED WINDOW RATE LIMITING
const generalRateLimit = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15,
  handler: function(req,res){
    res.status(429).send("You exceeded the rate limit")
  },
});

//MIDDLEWARE
app.use(generalRateLimit);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//ROUTES
app.use('/region', region);
app.use('/vendor', vendor);

//TEST
const twitter = new TwitterClient({
  c_key: process.env.TWITTER_CONSUMER_KEY,
  c_secret: process.env.TWITTER_CONSUMER_SECRET,
  a_key: process.env.TWITTER_ACCESS_TOKEN,
  a_secret: process.env.TWITTER_ACCESS_SECRET,
  regionID: 'WASHINGTONDC'
});
twitter.streamClient();

//START SERVER
server.listen(app.get('port'), () => {
  console.log('You are flying on ' + app.get('port'));
})

//FOR TESTING
module.exports = app;
