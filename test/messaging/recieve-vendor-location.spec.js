//DEPENDENCIES
const mongoose = require('../../lib/db/mongo/mongoose/index');
const chai = require('chai');
const expect = chai.expect;
const recieveVendorLocation = require('../../lib/messaging/recieve/recieve-vendor-location.js');
const redisClient = require('../../lib/db/redis/index');
//OPERATIONS
const vendorOps = require('../../lib/db/mongo/operations/vendor-ops');
const regionOps = require('../../lib/db/mongo/operations/region-ops');
//SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
//SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

describe('Message Recieve Vendor Location', function() {
  describe('setVendorActive', function() {
    let region;
    let vendor;

    beforeEach(async function(){
      await seed.runSeed().then(async () => {
        region = await Region.findOne()
        .catch( err => {
          const errMsg = new Error(err);
          console.error(errMsg);
        });
        vendor = await Vendor.findOne({"regionID": await region._id})
        .catch( err => {
          const errMsg = new Error(err);
          console.error(errMsg);
        });
      });
    });

    it('expect setVendorActive to clear cache for getVendorID route', async function() {
      const query = `q::method::GET::path::/${region._id}/${vendor._id}`;
      const collectionKey = 'vendor';
      await redisClient.hsetAsync(collectionKey, query, '{"test":"data"}');
      const cacheResBefore = await redisClient.hgetAsync(collectionKey, query);

      await recieveVendorLocation.setVendorActive(region, vendor);
      const cacheResAfter = await redisClient.hgetAsync(collectionKey, query);

      expect(cacheResBefore).to.be.equal('{"test":"data"}');
      expect(cacheResAfter).to.be.equal(null);
    });

    it('expect setVendorActive to clear cache for getVendors route', async function() {
      const query = `q::method::GET::path::/${region._id}`;
      const collectionKey = 'vendor';
      await redisClient.hsetAsync(collectionKey, query, '{"test2":"data"}');
      const cacheResBefore = await redisClient.hgetAsync(collectionKey, query);

      await recieveVendorLocation.setVendorActive(region, vendor);
      const cacheResAfter = await redisClient.hgetAsync(collectionKey, query);

      expect(cacheResBefore).to.be.equal('{"test2":"data"}');
      expect(cacheResAfter).to.be.equal(null);
    });

    it('expect setVendorActive to add vendorID to dailyActiveVendorIDs', async function() {
      const dailyActiveVendorIDsLenBefore = region.dailyActiveVendorIDs.length;
      await recieveVendorLocation.setVendorActive(region, vendor);
      let updatedRegion = await Region.findOne({'_id': region._id})
      .catch( err => {
        const errMsg = new Error(err);
        console.error(errMsg);
      });
      const dailyActiveVendorIDsLenAfter = updatedRegion.dailyActiveVendorIDs.length;

      expect(dailyActiveVendorIDsLenBefore).to.equal(0);
      expect(dailyActiveVendorIDsLenAfter).to.equal(dailyActiveVendorIDsLenBefore + 1);
    });

    it('expect setVendorActive to set dailyActive of vendor to true', async function() {
      const dailyActiveBefore = vendor.dailyActive;
      await recieveVendorLocation.setVendorActive(region, vendor);
      let updatedVendor = await Vendor.findOne({'_id': vendor._id})
      .catch( err => {
        const errMsg = new Error(err);
        console.error(errMsg);
      });
      const dailyActiveAfter = updatedVendor.dailyActive;

      expect(dailyActiveBefore).to.equal(false);
      expect(dailyActiveAfter).to.equal(true);
    });
  });
});
