//DEPENDENCIES
const chai            = require('chai');
const expect          = chai.expect;
const mongoose        = require('../../lib/config/mongoose');
const redisClient     = require('../../lib/config/redis');
const redisOperations = require('../../lib/db/redis/redisOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//SEED
const seed                = require('../../lib/db/seeds/developmentSeed');

describe('Redis Operations', function() {
  describe('resetVendorLocationAndComment', function() {
    let region;
    let vendor;
    let pathLocationAccuracy;
    let pathComment;
    let commentKey;
    let locationAccuracyKey;

    before(async function() {
      await seed.runSeed().then(async () => {
        region = await Region.findOne();
        vendor = await Vendor.findOne({"regionID": await region._id});
        pathLocationAccuracy = `/${region._id}/${vendor._id}/locationaccuracy`;
        pathComment = `/${region._id}/${vendor._id}/comments`;
        commentKey = `rl::method::PUT::path::${pathComment}::regionID::${region._id}::vendorID::${vendor._id}`;
        locationAccuracyKey = `rl::method::PUT::path::${pathLocationAccuracy}::regionID::${region._id}::vendorID::${vendor._id}`;
      });
    })

    it('Expect a vendor location and comment path to both be emptied', async function() {
      //Add fake IPs addresses to the comment and location accuracy redis sets
      const addComment = await redisClient.saddAsync(commentKey, 'test1234');
      const addLocationAccuracy = await redisClient.saddAsync(locationAccuracyKey, 'test1234');
      //Check if there are fake IP addresses added
      const redisCommentIPsBefore = await redisClient.smembersAsync(commentKey);
      const redisLocationAccuracyIPsBefore = await redisClient.smembersAsync(locationAccuracyKey);
      expect(redisCommentIPsBefore.length).to.be.equal(1);
      expect(redisLocationAccuracyIPsBefore.length).to.be.equal(1);
      //Reset IP addresses
      await redisOperations.resetVendorLocationAndComment(region._id, vendor._id);
      const redisCommentIPsAfter = await redisClient.smembersAsync(commentKey);
      const redisLocationAccuracyIPsAfter = await redisClient.smembersAsync(locationAccuracyKey);
      expect(redisCommentIPsAfter.length).to.be.equal(0);
      expect(redisLocationAccuracyIPsAfter.length).to.be.equal(0);
    });
  })
});
