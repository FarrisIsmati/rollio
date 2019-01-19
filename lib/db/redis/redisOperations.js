//DEPENDENCIES
const redisClient         = require('../../config/redis');

const redisOperations = {
  resetVendorLocationAndComment: async (regionID, vendorID) => {
    //Delete the keys related to commenting on the vendor or upvoting the location accuracy
    const pathLocationAccuracy = `/${regionID}/${vendorID}/locationaccuracy`
    const pathComment = `/${regionID}/${vendorID}/comments`
    const redisKeyLocationAccuracy = `rl::method::PUT::path::${pathLocationAccuracy}::regionID::${regionID}::vendorID::${vendorID}`;
    const redisKeyComment = `rl::method::PUT::path::${pathComment}::regionID::${regionID}::vendorID::${vendorID}`;
    await redisClient.delAsync(redisKeyLocationAccuracy)
    .catch( (e) => console.log(e) );
    await redisClient.delAsync(redisKeyComment)
    .catch( (e) => console.log(e) );
  }
}

module.exports = redisOperations
