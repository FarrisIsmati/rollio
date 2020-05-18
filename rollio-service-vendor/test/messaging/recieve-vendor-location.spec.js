/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
chai.use(require('chai-datetime'));

const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;
const receiveVendorLocation = require('../../lib/messaging/receive/receive-vendor-location.js');
const vendorOps = require('../../lib/db/mongo/operations/vendor-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

describe('Message Receive Vendor Location', () => {
  describe('update location', () => {
    let region;
    let vendor;

    beforeEach(async () => {
      await seed.runSeed().then(async () => {
        region = await Region.findOne()
          .catch((err) => {
            const errMsg = new Error(err);
            console.error(errMsg);
          });
        vendor = await Vendor.findOne({ regionID: region._id })
          .catch((err) => {
            const errMsg = new Error(err);
            console.error(errMsg);
          });
      });
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
