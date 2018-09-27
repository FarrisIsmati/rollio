const redisClient = require('../../db/redis-config');

const redisRouteLimit = {
  //Limit this route to one request, gets reset
  limitSingleVendorRouteReq: async (req, res, next) => {
    //Key is identified as Method (GET, PUT, POST, DEL), regionID, & vendorID
    const key = `rl::method::${req.method}::path::${req.path}::regionID::${req.params.regionID}::vendorID::${req.params.vendorID}`;

    //Value is identified as the result value of adding to a Redis Set (1 if it doesn't exist 0 if it does exist)
    const value = await redisClient.saddAsync(key, req.connection.remoteAddress)
    .then( res => res )
    .catch( () => res.status(500).send("Internal server error") );

    if (redisClient.connected) {
      //If value is not equal to 1 then the user has already sent a request to this route
      if (value !== 1) {
        res.status(429).send("The user has sent too many requests to this route");
      }
    } else {
      res.status(500).send("Internal server error");
    }

    next();
  }
}

module.exports = redisRouteLimit;
