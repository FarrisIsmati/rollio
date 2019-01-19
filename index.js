//ENV
require('dotenv').config();
//DEPENDENCIES
const app = require('express')();
      app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const socketIO = require('socket.io');
const rateLimit = require('express-rate-limit');
const http = require('http');
const server = require('http').createServer(app);
const vendorAddress = require('./lib/subscriptions/vendor-address');
//ROUTES
const region = require('./lib/routes/region');
const vendor = require('./lib/routes/vendor');

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

app.set('port', process.env.PORT || 3001);
if (process.env.NODE_ENV === 'PRODUCTION')
  app.enable("trust proxy");// only if behind a reversed proxy (AWS is the goal)

// //Setup subscriptions
// if (process.env.NODE_ENV !== 'TEST') {
//   rabbitmq subscription method
// }

//Fixed window rate limiting
const generalRateLimit = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15,
  handler: function(req,res){
    res.status(429).send("You exceeded the rate limit")
  },
});

app.use(generalRateLimit);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/region', region);
app.use('/vendor', vendor);

server.listen(app.get('port'), () => {
  console.log('You are flying on ' + app.get('port'));
})

//For testing
module.exports = app;
