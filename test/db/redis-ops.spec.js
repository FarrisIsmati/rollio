//DEPENDENCIES
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('../../lib/db/mongo/mongoose/index');
const client = require('../../lib/db/redis/index');
const redisOps = require('../../lib/db/redis/operations/redis-ops');
//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');
//SEED
const seed                = require('../../lib/db/mongo/seeds/dev-seed');

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
      const addComment = await client.saddAsync(commentKey, 'test1234');
      const addLocationAccuracy = await client.saddAsync(locationAccuracyKey, 'test1234');
      //Check if there are fake IP addresses added
      const redisCommentIPsBefore = await client.smembersAsync(commentKey);
      const redisLocationAccuracyIPsBefore = await client.smembersAsync(locationAccuracyKey);
      expect(redisCommentIPsBefore.length).to.be.equal(1);
      expect(redisLocationAccuracyIPsBefore.length).to.be.equal(1);
      //Reset IP addresses
      await redisOps.resetVendorLocationAndComment(region._id, vendor._id);
      const redisCommentIPsAfter = await client.smembersAsync(commentKey);
      const redisLocationAccuracyIPsAfter = await client.smembersAsync(locationAccuracyKey);
      expect(redisCommentIPsAfter.length).to.be.equal(0);
      expect(redisLocationAccuracyIPsAfter.length).to.be.equal(0);
    });
  })
});
