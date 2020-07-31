/* eslint-disable no-console */
// DEPENDENCIES
const chai = require('chai');
const chaid = require('chaid');
const moment = require('moment');
const { sortBy, omit } = require('lodash');
const dateTime = require('chai-datetime');
const assertArrays = require('chai-arrays');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../../lib/db/mongo/mongoose/index');
const sinon = require('sinon');

const { expect } = chai;

// OPERATIONS
const vendorOps = require('../../../lib/db/mongo/operations/vendor-ops');
// const regionOps = require('../../../lib/db/mongo/operations/region-ops');
// const tweetOps = require('../../../lib/db/mongo/operations/tweet-ops');
// const userOps = require('../../../lib/db/mongo/operations/user-ops');
// const sharedOps = require('../../../lib/db/mongo/operations/shared-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('DB Operations', () => {
  afterEach(() => {
    // Restore the default sandbox here
    sinon.restore();
  });

  describe('Vendor DB Operations', () => {
    describe('Get Vendor Operations', () => {
      it('expects getVendor to pass both arguments to Vendor.findOne method', (done) => {
        const findOneSpy = sinon.spy(Vendor, 'findOne');
        const expectedArgument = {
          regionID: 'arg1',
          _id: 'arg2'
        };

        vendorOps.getVendor('arg1', 'arg2');
        sinon.assert.calledWith(findOneSpy, expectedArgument);
        done();
      });

      it('expects getVendor to pass both arguments to Vendor.findOne method', (done) => {
        // const findOneSpy = sinon.spy(Vendor, 'findOne');
        // const expectedArgument = {
        //   regionID: 'arg1',
        //   _id: 'arg2'
        // };

        // vendorOps.getVendor('arg1', 'arg2');
        // sinon.assert.calledWith(findOneSpy, expectedArgument);
        // done();
      });

      it('expect to return a vendor given a regionID and a vendor twitterID', (done) => {
        done();
      });

      it('expect a vendor given an object with a set of mongo query parameters, expect number of consecuitve days inactive vendors 7', (done) => {
        done();
      });
    });

    // // UPDATE VENDOR DB OPERATIONS
    // describe('Update Vendor Operations', () => {
    //   let vendor;
    //   let regionID;
    //   let locationID;
    //   let userLocationID;

    //   beforeEach((done) => {
    //     seed.runSeed().then(async () => {
    //       regionID = await Region.findOne().then(region => region._id);
    //       vendor = await Vendor.findOne({
    //         regionID: await regionID, 'locationHistory.0': { $exists: true }, 'userLocationHistory.0': { $exists: true },
    //       });
    //       locationID = vendor.locationHistory[vendor.locationHistory.length - 1];
    //       userLocationID = vendor.userLocationHistory[vendor.userLocationHistory.length - 1];
    //       done();
    //     });
    //   });

    //   it('expect new coordinate object pushed into locationHistory', async () => {
    //     const coordinatesPayload = { locationDate: new Date('2018-02-18T16:22:00Z'), address: '28 Ist', coordinates: { lat: 1.123, long: 4.523 } };
    //     const newLocation = await Location.create({ ...coordinatesPayload, TweetID: 'blah', vendorID: vendor._id });


    //     const prevCoordHist = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorPrev => vendorPrev.locationHistory);

    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'locationHistory', payload: newLocation._id,
    //     };
    //     await vendorOps.updateVendorPush(params);

    //     const updatedCoordHist = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
    //       .then(vendorUpdated => vendorUpdated.locationHistory);

    //     expect(updatedCoordHist[updatedCoordHist.length - 1].locationDate)
    //       .to.equalDate(coordinatesPayload.locationDate);
    //     expect(updatedCoordHist[updatedCoordHist.length - 1].address)
    //       .to.deep.equal(coordinatesPayload.address);
    //     expect(updatedCoordHist[updatedCoordHist.length - 1].coordinates.toObject())
    //       .to.deep.equal(coordinatesPayload.coordinates);
    //     expect(updatedCoordHist.length).to.equal(prevCoordHist.length + 1);
    //   });

    //   it('Expect new object to be pushed to the start position of Comments', async () => {
    //     const commentPayload = {
    //       name: 'Jim',
    //       text: 'test1',
    //     };

    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'comments', payload: commentPayload, position: 0,
    //     };
    //     const updateCommentsRes = await vendorOps.updateVendorPushPosition(params);

    //     expect(updateCommentsRes.comments[0].name).to.be.equal(commentPayload.name);
    //     expect(updateCommentsRes.comments[0].text).to.be.equal(commentPayload.text);
    //     // just checking that it populates tweets correctly
    //     expect(updateCommentsRes.tweetHistory.length).to.be.equal(1);
    //     expect(updateCommentsRes.tweetHistory.every(tweet => tweet.text)).to.be.true;
    //   });

    //   it('expect new tweet to be added to tweetHistory', async () => {
    //     const tweetPayload = {
    //       tweetID: '1xtwittera7v2',
    //       date: new Date('2017-02-18T08:20:00Z'),
    //       text: 'test tweet',
    //       locations: [new ObjectId(), new ObjectId()],
    //     };

    //     const prevDailyTweets = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorPrev => vendorPrev.tweetHistory);

    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'tweetHistory', payload: tweetPayload,
    //     };
    //     await vendorOps.updateVendorPush(params);

    //     const updatedDailyTweets = await Vendor.findOne({ _id: vendor._id })
    //       .populate('tweetHistory')
    //       .then(vendorUpdated => vendorUpdated.tweetHistory);

    //     const { locations: updatedTweetLocations } = updatedDailyTweets[updatedDailyTweets.length - 1];
    //     expect(updatedDailyTweets[updatedDailyTweets.length - 1]
    //       .tweetID).to.equal(tweetPayload.tweetID);
    //     expect(updatedDailyTweets[updatedDailyTweets.length - 1].date)
    //       .to.equalDate(tweetPayload.date);
    //     expect(updatedTweetLocations.map(location => String(location))).to.deep.equal(tweetPayload.locations.map(location => String(location)));
    //     expect(updatedDailyTweets.length).to.equal(prevDailyTweets.length + 1);
    //   });

    //   it('expect updateVendorSet to update multiple fields in one operation', async () => {
    //     const newEmail = 'test@gmail.com';
    //     const newDescription = 'test123';
    //     const prevVendor = await Vendor.findOne({ _id: vendor._id });

    //     const params = {
    //       regionID, vendorID: vendor._id, field: ['description', 'email'], data: [newDescription, newEmail],
    //     };
    //     const updatedVendor = await vendorOps.updateVendorSet(params);

    //     expect(prevVendor.description).to.not.be.equal(newDescription);
    //     expect(prevVendor.email).to.not.be.equal(newEmail);
    //     expect(updatedVendor.description).to.be.equal(newDescription);
    //     expect(updatedVendor.email).to.be.equal(newEmail);
    //   });

    //   it('expect location accuracy to be incremented by 1', async () => {
    //     const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
    //       .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

    //     await vendorOps.updateLocationAccuracy({
    //       regionID, vendorID: vendor._id, type: 'locationHistory', locationID, amount: 1,
    //     });

    //     const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
    //       .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

    //     expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy + 1);
    //   });

    //   it('expect location accuracy to be decremented by 1', async () => {
    //     const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
    //       .then(vendorPrev => vendorPrev.locationHistory[0].accuracy);

    //     vendorOps.updateLocationAccuracy({
    //       regionID, vendorID: vendor._id, type: 'locationHistory', locationID, amount: -1,
    //     });

    //     const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('locationHistory')
    //       .then(vendorUpdated => vendorUpdated.locationHistory[0].accuracy);

    //     expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy - 1);
    //   });

    //   it('Expect user location accuracy to be incremented by 1', async () => {
    //     const prevLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
    //       .then(vendorPrev => vendorPrev.userLocationHistory[0].accuracy);

    //     await vendorOps.updateLocationAccuracy({
    //       regionID, vendorID: vendor._id, type: 'userLocationHistory', locationID: userLocationID, amount: 1,
    //     });

    //     const updatedLocationAccuracy = await Vendor.findOne({ _id: vendor._id }).populate('userLocationHistory')
    //       .then(vendorUpdated => vendorUpdated.userLocationHistory[0].accuracy);

    //     expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy + 1);
    //   });

    //   it('expect consecutiveDaysInactive to be incremented by one', async () => {
    //     const prevConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorPrev => vendorPrev.consecutiveDaysInactive);

    //     const updateConsecutiveDaysInactiveRes = await vendorOps
    //       .incrementVendorConsecutiveDaysInactive(regionID, vendor._id);

    //     const updatedConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorUpdated => vendorUpdated.consecutiveDaysInactive);

    //     expect(updateConsecutiveDaysInactiveRes.nModified).to.equal(1);
    //     expect(updatedConsecutiveDaysInactive).to.be.equal(prevConsecutiveDaysInactive + 1);
    //   });

    //   it('expect updateVendorSet to set consecutiveDaysInactive to -1', async () => {
    //     await vendorOps.incrementVendorConsecutiveDaysInactive(regionID, vendor._id);

    //     const prevConsecutiveDaysInactive = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorPrev => vendorPrev.consecutiveDaysInactive);

    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'consecutiveDaysInactive', data: -1,
    //     };
    //     const updatedConsecutiveDaysInactive = await vendorOps.updateVendorSet(params)
    //       .then(vendorUpdated => vendorUpdated.consecutiveDaysInactive);

    //     // Starts at 4
    //     expect(prevConsecutiveDaysInactive).to.be.equal(5);
    //     expect(updatedConsecutiveDaysInactive).to.be.equal(-1);
    //   });

    //   it('expect Vendor name to update to Lobster Town', async () => {
    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'name', data: 'Lobster Town',
    //     };
    //     const updatedName = await vendorOps.updateVendorSet(params)
    //       .then(vendorUpdated => vendorUpdated.name);

    //     expect(updatedName).to.be.equal('Lobster Town');
    //   });

    //   it('expect closedDate of Vendor to update', async () => {
    //     const date = new Date('2018-02-18T16:22:00Z');

    //     const prevClosedDate = await Vendor.findOne({ _id: vendor._id })
    //       .then(vendorPrev => vendorPrev.closedDate);

    //     const params = {
    //       regionID, vendorID: vendor._id, field: 'closedDate', data: date,
    //     };
    //     const updatedClosedDate = await vendorOps.updateVendorSet(params)
    //       .then(vendorUpdated => vendorUpdated.closedDate);

    //     expect(prevClosedDate).to.be.an('undefined');
    //     expect(updatedClosedDate).to.equalDate(date);
    //   });

    //   it('expect new location to be added to Vendor locationHistory', async () => {
    //     const locationData = {
    //       address: '123 street',
    //       matchMethod: 'Vendor Input',
    //       coordinates: [0, 1],
    //       truckNum: 1,
    //     };
    //     const newLocation = await vendorOps.createNonTweetLocation(vendor._id, locationData);
    //     const updatedVendor = await Vendor.findOne({ _id: vendor._id });
    //     expect(updatedVendor.locationHistory[0].toString()).to.equal(String(newLocation._id));
    //   });

    //   it('expect edit location to be change Vendor location', async () => {
    //     const locationData = {
    //       address: '123 street',
    //       matchMethod: 'Vendor Input',
    //       coordinates: [0, 1],
    //       truckNum: 1,
    //     };
    //     const editedLocation = await vendorOps.updateNonTweetLocation(locationID, vendor._id, locationData);
    //     const updatedVendor = await Vendor.findOne({ _id: vendor._id });
    //     expect(editedLocation.overridden).to.be.false;
    //     expect(updatedVendor.locationHistory[0].toString()).to.equal(String(editedLocation._id));
    //   });
    // });
  });

  describe('Shared DB Operations', () => {
    const initLocationData = {
      vendorID: new ObjectId(),
      address: '123 street',
      matchMethod: 'Vendor Input',
      truckNum: 1,
      coordinates: { lat: 0, long: 0 },
    };

    it('expect createLocationAndCorrectConflicts to ensure that one truck is not in two places at once', (done) => {
      done();
    });
  });
});
