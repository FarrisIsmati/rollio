//ENV
require('dotenv').config();

//DEPENDENCIES
const redisClient = require('../../db/redis-config');

//Limit this route to one request, gets reset
const routeLimitVendorOp = async (req, res) => {
  //Key is identified as Method (GET, PUT, POST, DEL), regionID, & vendorID
  const key = `rl::method::${req.method}::path::${req.path}::regionID::${req.params.regionID}::vendorID::${req.params.vendorID}`;
  console.log(key);
  //Value is identified as the result value of adding to a Redis Set (1 if it doesn't exist 0 if it does exist)
  const value = await redisClient.saddAsync(key, req.connection.remoteAddress)
  .catch( () => res.status(500).send("Internal server error") );

  if (redisClient.connected) {
    //If value is not equal to 1 then the user has already sent a request to this route
    if (value !== 1) {
      res.status(429).send("The user has sent too many requests to this route");
    }
  } else {
    res.status(500).send("Internal server error");
  }

  return value;
}

//Seperate the routeLimit functions so I can test it
const routeLimitVendor = async (req, res, next) => {
  //If enviroment is not in test then rate limit
  if (process.env.NODE_ENV !== 'TEST') {
    const result = await routeLimitVendorOp(req, res);
    if (result) {
      next();
    }
  } else {
    next();
  }

}

//Not originally packaging it in an object because scope of this was set to express call and not the object
module.exports = {
  routeLimitVendorOp,
  routeLimitVendor
};
