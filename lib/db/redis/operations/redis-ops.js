//DEPENDENCIES
const client = require('../index');

module.exports = {
  resetVendorLocationAndComment: async (regionID, vendorID) => {
    //Delete the keys related to commenting on the vendor or upvoting the location accuracy
    //Paths
    const pathLocationAccuracy = `/${regionID}/${vendorID}/locationaccuracy`
    const pathComment = `/${regionID}/${vendorID}/comments`
    //Keys
    const redisKeyLocationAccuracy = `rl::method::PUT::path::${pathLocationAccuracy}::regionID::${regionID}::vendorID::${vendorID}`;
    const redisKeyComment = `rl::method::PUT::path::${pathComment}::regionID::${regionID}::vendorID::${vendorID}`;
    //Actions
    await client.delAsync(redisKeyLocationAccuracy)
    .catch( (e) => console.log(e) );
    await client.delAsync(redisKeyComment)
    .catch( (e) => console.log(e) );
  }
}
