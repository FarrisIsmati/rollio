/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');
const dateTime = require('chai-datetime');
const assertArrays = require('chai-arrays');
const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;

// OPERATIONS
const vendorOps = require('../../lib/db/mongo/operations/vendor-ops');
const regionOps = require('../../lib/db/mongo/operations/region-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('DB Operations', () => {
  describe('Vendor DB Operations', () => {
    describe('Get Vendor Operations', () => {
      let regionID;
      let vendor;

      before(async () => {
        await seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendor = await Vendor.findOne({ regionID: await regionID });
        });
      });

      it('expect all vendors given a regionID', (done) => {
        vendorOps.getVendors(regionID)
          .then((res) => {
            expect(res).to.be.array();
            expect(res[0].regionID).to.have.same.id(regionID);
            // just testing that it is populating the tweets
            expect(res.every(vendor => vendor.tweetHistory.every(tweet => tweet.text))).to.be.true;
            done();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

      it('expect a vendor given a regionID and an objectID', (done) => {
        vendorOps.getVendor(regionID, vendor._id)
          .then((res) => {
            expect(res).to.have.same.id(vendor);
            // just checking that it populates tweets correctly
            expect(res.tweetHistory.every(tweet => tweet.text)).to.be.true;
            done();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

      it('expect to return a vendor given a regionID and a vendor twitterID', async () => {
        const arepaCrewTwitterID = '3183153867';
        const region = await regionOps.getRegionByName('WASHINGTONDC');
        // Arepa Crew id
        const vendorArepaCrew = await vendorOps
          .getVendorByTwitterID(region._id, arepaCrewTwitterID);
        expect(vendorArepaCrew.twitterID).to.equal(arepaCrewTwitterID);
      });

      it('expect a vendor given an object with a set of mongo query parameters, expect number of consecuitve days inactive vendors 7', (done) => {
        const params = {
          regionID,
          consecutiveDaysInactive: -1,
        };
        vendorOps.getVendorsByQuery(params)
          .then((res) => {
            expect(res.length).to.be.equal(7);
            for (let i = 0; i < res.length; i += 1) {
              expect(parseInt(res[i].consecutiveDaysInactive, 10)).to.be.equal(-1);
            }
            done();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

      after((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });

    // UPDATE VENDOR DB OPERATIONS
    describe('Update Vendor Operations', () => {
      let vendor;
      let regionID;
      let locationID;
      let userLocationID;

      beforeEach((done) => {
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendor = await Vendor.findOne({ regionID: await regionID });
          locationID = vendor.locationHistory[vendor.locationHistory.length - 1]._id;
          userLocationID = vendor.userLocationHistory[vendor.userLocationHistory.length - 1]._id;
          done();
        });
      });

      it('expect new coordinate object pushed into locationHistory', async () => {
        const coordinatesPayload = { locationDate: new Date('2018-02-18T16:22:00Z'), address: '28 Ist', coordinates: [1.123, 4.523] };

        const prevCoordHist = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.locationHistory);

        const params = {
          regionID, vendorID: vendor._id, field: 'locationHistory', payload: coordinatesPayload,
        };
        const updateCoordHistRes = await vendorOps.updateVendorPush(params)
          .then(res => res);

        const updatedCoordHist = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorUpdated => vendorUpdated.locationHistory);

        expect(updateCoordHistRes.nModified).to.equal(1);
        expect(updatedCoordHist[updatedCoordHist.length - 1].locationDate)
          .to.equalDate(coordinatesPayload.locationDate);
        expect(updatedCoordHist[updatedCoordHist.length - 1].address)
          .to.deep.equal(coordinatesPayload.address);
        expect(updatedCoordHist[updatedCoordHist.length - 1].coordinates)
          .to.deep.equal(coordinatesPayload.coordinates);
        expect(updatedCoordHist.length).to.equal(prevCoordHist.length + 1);
      });

      it('Expect new object to be pushed to the start position of Comments', async () => {
        const commentPayload = {
          name: 'Jim',
          text: 'test1',
        };

        const params = {
          regionID, vendorID: vendor._id, field: 'comments', payload: commentPayload, position: 0,
        };
        const updateCommentsRes = await vendorOps.updateVendorPushPosition(params);

        expect(updateCommentsRes.comments[0].name).to.be.equal(commentPayload.name);
        expect(updateCommentsRes.comments[0].text).to.be.equal(commentPayload.text);
      });

      it('expect new tweet to be added to tweetHistory', async () => {
        const tweetPayload = {
          tweetID: '1xtwittera7v2',
          date: new Date('2017-02-18T08:20:00Z'),
          text: 'test tweet',
          location: {
            locationDate: new Date('2017-02-18T08:20:00Z'),
            coordinates: [38.24561, -77.86542],
            address: '123 street',
            accuracy: 1
          }
        };

        const prevDailyTweets = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.tweetHistory);

        const params = {
          regionID, vendorID: vendor._id, field: 'tweetHistory', payload: tweetPayload,
        };
        const updateDailyTweetsRes = await vendorOps.updateVendorPush(params)
          .then(res => res);

        const updatedDailyTweets = await Vendor.findOne({ _id: vendor._id })
          .populate('tweetHistory')
          .then(vendorUpdated => vendorUpdated.tweetHistory);

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1]
          .tweetID).to.equal(tweetPayload.tweetID);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].date)
          .to.equalDate(tweetPayload.date);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1]
          .location.locationDate).to.deep.equal(tweetPayload.location.locationDate);
        expect(updatedDailyTweets.length).to.equal(prevDailyTweets.length + 1);
      });

      it('expect dailyActive to be set from false to true', async () => {
        const targetVendor = await Vendor.findOne({ dailyActive: false });

        const vendorID = targetVendor._id;
        const prevDailyActive = targetVendor.dailyActive;

        const params = {
          regionID, vendorID, field: 'dailyActive', data: true,
        };
        const updateDailyActiveRes = await vendorOps.updateVendorSet(params);

        const updatedDailyActive = await Vendor.findOne({ _id: vendorID })
          .then(vendorUpdated => vendorUpdated.dailyActive);

        expect(prevDailyActive).to.be.false;
        expect(updateDailyActiveRes.nModified).to.equal(1);
        expect(updatedDailyActive).to.be.true;
      });

      it('expect updateVendorSet to update multiple fields in one operation', async () => {
        const newEmail = 'test@gmail.com';
        const newDescription = 'test123';
        const prevVendor = await Vendor.findOne({ _id: vendor._id });

        const params = {
          regionID, vendorID: vendor._id, field: ['description', 'email'], data: [newDescription, newEmail],
        };
        const updatedVendorRes = await vendorOps.updateVendorSet(params)
          .then(res => res);

        const updatedVendor = await Vendor.findOne({ _id: vendor._id });

        expect(prevVendor.description).to.not.be.equal(newDescription);
        expect(prevVendor.email).to.not.be.equal(newEmail);
        expect(updatedVendorRes.nModified).to.equal(1);
        expect(updatedVendor.description).to.be.equal(newDescription);
        expect(updatedVendor.email).to.be.equal(newEmail);
      });

      it('expect location accuracy to be incremented by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

        const updateLocationAccuracy = await vendorOps.updateLocationAccuracy({
          regionID, vendorID: vendor._id, type: 'locationHistory', locationID, amount: 1,
        });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

        expect(updateLocationAccuracy.nModified).to.equal(1);
        expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy + 1);
      });

      it('expect location accuracy to be decremented by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

        const updateLocationAccuracy = await vendorOps.updateLocationAccuracy({
          regionID, vendorID: vendor._id, type: 'locationHistory', locationID, amount: -1,
        });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
          .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

        expect(updateLocationAccuracy.nModified).to.equal(1);
        expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy - 1);
      });

      it('Expect user location accuracy to be incremented by 1', async () => {
        const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
          .then(vendorPrev => vendorPrev.userLocationHistory[0].accuracy);

        const updateLocationAccuracy = await vendorOps.updateLocationAccuracy({
          regionID, vendorID: vendor._id, type: 'userLocationHistory', locationID: userLocationID, amount: 1,
        });

        const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
          .then(vendorUpdated => vendorUpdated.userLocationHistory[0].accuracy);

        expect(updateLocationAccuracy.nModified).to.equal(1);
        expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy + 1);
      });

      it('expect consecutiveDaysInactive to be incremented by one', async () => {
        const prevConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.consecutiveDaysInactive);

        const updateConsecutiveDaysInactiveRes = await vendorOps
          .incrementVendorConsecutiveDaysInactive(regionID, vendor._id).then(res => res);

        const updatedConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
          .then(vendorUpdated => vendorUpdated.consecutiveDaysInactive);

        expect(updateConsecutiveDaysInactiveRes.nModified).to.equal(1);
        expect(updatedConsecutiveDaysInactive).to.be.equal(prevConsecutiveDaysInactive + 1);
      });

      it('expect updateVendorSet to set consecutiveDaysInactive to -1', async () => {
        await vendorOps.incrementVendorConsecutiveDaysInactive(regionID, vendor._id);

        const prevConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.consecutiveDaysInactive);

        const params = {
          regionID, vendorID: vendor._id, field: 'consecutiveDaysInactive', data: -1,
        };
        const updateConsecutiveDaysInactiveRes = await vendorOps.updateVendorSet(params)
          .then(res => res);

        const updatedConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
          .then(vendorUpdated => vendorUpdated.consecutiveDaysInactive);

        // Starts at 4
        expect(prevConsecutiveDaysInactive).to.be.equal(5);

        expect(updateConsecutiveDaysInactiveRes.nModified).to.equal(1);
        expect(updatedConsecutiveDaysInactive).to.be.equal(-1);
      });

      it('expect Vendor name to update to Lobster Town', async () => {
        const params = {
          regionID, vendorID: vendor._id, field: 'name', data: 'Lobster Town',
        };
        const updateNameRes = await vendorOps.updateVendorSet(params)
          .then(res => res);

        const updatedName = await Vendor.findOne({ _id: vendor._id })
          .then(vendorUpdated => vendorUpdated.name);

        expect(updateNameRes.nModified).to.equal(1);
        expect(updatedName).to.be.equal('Lobster Town');
      });

      it('expect closedDate of Vendor to update', async () => {
        const date = new Date('2018-02-18T16:22:00Z');

        const prevClosedDate = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.closedDate);

        const params = {
          regionID, vendorID: vendor._id, field: 'closedDate', data: date,
        };
        const updateClosedDateRes = await vendorOps.updateVendorSet(params)
          .then(res => res);

        const updatedClosedDate = await Vendor.findOne({ _id: vendor._id })
          .then(vendorUpdated => vendorUpdated.closedDate);

        expect(prevClosedDate).to.be.an('undefined');
        expect(updateClosedDateRes.nModified).to.equal(1);
        expect(updatedClosedDate).to.equalDate(date);
      });

      afterEach((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });
  });

  // REGION DB OPERATIONS
  describe('Region DB Operations', () => {
    // GET REGION DB OPERATIONS
    describe('Get Region Operations', () => {
      let regionID;

      before((done) => {
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          done();
        });
      });

      it('expect getRegion to return a region given a regionID', (done) => {
        regionOps.getRegion(regionID)
          .then((res) => {
            expect(res._id).to.have.same.id(regionID);
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect getRegionByName to return a region with the name WASHINGTONDC', (done) => {
        regionOps.getRegionByName('WASHINGTONDC')
          .then((res) => {
            expect(res.name).to.be.equal('WASHINGTONDC');
            done();
          })
          .catch(err => console.error(err));
      });

      after((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });

    describe('Update Region Operations', () => {
      const regionName = 'WASHINGTONDC';
      let regionID;
      let vendorID;

      beforeEach((done) => {
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendorID = await Vendor.findOne({ regionID: await regionID }).then(vendor => vendor._id);
          done();
        });
      });

      it('expect incrementRegionDailyActiveVendorIDs to be incremented by 1 given a regionID', async () => {
        const prevRegionDailyActiveVendorIDs = await regionOps.getRegion(regionID)
          .then(res => res.dailyActiveVendorIDs.length);
        const updateRegionDailyActiveVendorIDsRes = await regionOps
          .incrementRegionDailyActiveVendorIDs({ regionID, vendorID });
        const updatedRegionDailyActiveVendorIDs = await regionOps.getRegion(regionID)
          .then(res => res.dailyActiveVendorIDs.length);

        expect(updateRegionDailyActiveVendorIDsRes.nModified).to.equal(1);
        expect(updatedRegionDailyActiveVendorIDs).to.equal(prevRegionDailyActiveVendorIDs + 1);
      });

      it('expect incrementRegionTotalDailyActive to be incremented by 1 given a regionName', async () => {
        const prevRegionDailyActiveVendorIDs = await regionOps.getRegionByName(regionName)
          .then(res => res.dailyActiveVendorIDs.length);
        const updateRegionDailyActiveVendorIDsRes = await regionOps
          .incrementRegionDailyActiveVendorIDs({ regionName, vendorID });
        const updatedRegionDailyActiveVendorIDs = await regionOps.getRegion(regionID)
          .then(res => res.dailyActiveVendorIDs.length);

        expect(updateRegionDailyActiveVendorIDsRes.nModified).to.equal(1);
        expect(updatedRegionDailyActiveVendorIDs).to.equal(prevRegionDailyActiveVendorIDs + 1);
      });

      it('expect incrementRegionDailyActiveVendorIDs to not insert a duplicate vendorID given a regionID', async () => {
        const prevRegionDailyActiveVendorIDs = await regionOps
          .getRegion(regionID).then(res => res.dailyActiveVendorIDs.length);
        const updateRegionDailyActiveVendorIDsRes = await regionOps
          .incrementRegionDailyActiveVendorIDs({ regionID, vendorID });
        const updateRegionDailyActiveVendorIDsDuplicateRes = await regionOps
          .incrementRegionDailyActiveVendorIDs({ regionID, vendorID });
        const updatedRegionDailyActiveVendorIDs = await regionOps.getRegion(regionID)
          .then(res => res.dailyActiveVendorIDs.length);

        expect(updateRegionDailyActiveVendorIDsRes.nModified).to.equal(1);
        expect(updateRegionDailyActiveVendorIDsDuplicateRes.nModified).to.equal(0);
        expect(updatedRegionDailyActiveVendorIDs).to.equal(prevRegionDailyActiveVendorIDs + 1);
      });

      afterEach((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });
  });
});
