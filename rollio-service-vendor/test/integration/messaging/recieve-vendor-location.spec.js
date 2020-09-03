/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
chai.use(require('chai-datetime'));
const { ObjectId } = require('mongoose').Types;

const mongoose = require('../../../lib/db/mongo/mongoose/index');

const { expect } = chai;
const receiveVendorLocation = require('../../../lib/messaging/receive/receive-vendor-location.js');
const vendorOps = require('../../../lib/db/mongo/operations/vendor-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// SEED
const seed = require('../../../lib/db/mongo/seeds/dev-seed');

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

    it('expect addLocationToVendorLocationHistory to update a vendors location and its updateDate properties', async () => {
      const vendorBefore = await vendorOps.getVendor(region._id, vendor._id);
      const locationId = new ObjectId();
      const actual = await receiveVendorLocation.addLocationToVendorLocationHistory(locationId, region._id, vendor._id);
      const expected = String(locationId);
      const vendorAfter = await Vendor.findOne({ _id: vendor._id });

      const oldDate = new Date(vendorBefore.updateDate);
      const newDate = new Date(vendorAfter.updateDate);

      expect(oldDate).to.be.beforeTime(newDate);
      expect(String(vendorAfter.locationHistory.pop())).to.equal(expected);
      expect(String(actual)).to.equal(expected);
    });
  });
});
