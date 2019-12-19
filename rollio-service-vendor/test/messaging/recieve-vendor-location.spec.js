/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
chai.use(require('chai-datetime'));

const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;
const receiveVendorLocation = require('../../lib/messaging/receive/receive-vendor-location.js');
const { client: redisClient } = require('../../lib/redis/index');
const vendorOps = require('../../lib/db/mongo/operations/vendor-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

describe('Message Receive Vendor Location', () => {
  describe('setVendorActive', () => {
    let region;
    let vendor;

    beforeEach(async () => {
      await seed.runSeed().then(async () => {
        region = await Region.findOne()
          .catch((err) => {
            const errMsg = new Error(err);
            console.error(errMsg);
          });
        vendor = await Vendor.findOne({ regionID: await region._id, dailyActive: false })
          .catch((err) => {
            const errMsg = new Error(err);
            console.error(errMsg);
          });
      });
    });

    it('expect setVendorActive to clear cache for getVendorID route', async () => {
      const query = `q::method::GET::path::/${region._id}/${vendor._id}`;
      const collectionKey = 'vendor';
      await redisClient.hsetAsync(collectionKey, query, '{"test":"data"}');
      const cacheResBefore = await redisClient.hgetAsync(collectionKey, query);

      await receiveVendorLocation.setVendorActive(region, vendor);
      const cacheResAfter = await redisClient.hgetAsync(collectionKey, query);

      expect(cacheResBefore).to.be.equal('{"test":"data"}');
      expect(cacheResAfter).to.be.equal(null);
    });

    it('expect setVendorActive to add vendorID to dailyActiveVendorIDs', async () => {
      const dailyActiveVendorIDsLenBefore = region.dailyActiveVendorIDs.length;
      await receiveVendorLocation.setVendorActive(region, vendor);
      const updatedRegion = await Region.findOne({ _id: region._id })
        .catch((err) => {
          const errMsg = new Error(err);
          console.error(errMsg);
        });
      const dailyActiveVendorIDsLenAfter = updatedRegion.dailyActiveVendorIDs.length;

      expect(dailyActiveVendorIDsLenBefore).to.equal(0);
      expect(dailyActiveVendorIDsLenAfter).to.equal(dailyActiveVendorIDsLenBefore + 1);
    });

    it('expect setVendorActive to set dailyActive of vendor to true', async () => {
      const dailyActiveBefore = vendor.dailyActive;
      await receiveVendorLocation.setVendorActive(region, vendor);
      const updatedVendor = await Vendor.findOne({ _id: vendor._id })
        .catch((err) => {
          const errMsg = new Error(err);
          console.error(errMsg);
        });
      const dailyActiveAfter = updatedVendor.dailyActive;

      expect(dailyActiveBefore).to.equal(false);
      expect(dailyActiveAfter).to.equal(true);
    });

    it('expect updateLocation to update a vendors location and its updateDate properties', async () => {
      const vendorBefore = await vendorOps.getVendor(region._id, vendor._id);

      const updateLocationPayload = { 
        accuracy: 3,
        coordinates: [72, 35],
        locationDate: '2018-11-01T12:00:00.000Z',
        address: '123 Fake Street',
        city: 'Springfield',
        neighborhood: 'Little Russia',
        matchMethod: 'Tweet location',
        tweetID: 'test123',
      };

      await receiveVendorLocation.updateLocation(updateLocationPayload, region, vendor);

      const vendorAfter = await vendorOps.getVendor(region._id, vendor._id);

      const oldDate = new Date(vendorBefore.updateDate);
      const newDate = new Date(vendorAfter.updateDate);

      expect(oldDate).to.be.beforeTime(newDate);
    });
  });
});
