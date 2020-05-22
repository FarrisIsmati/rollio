/* eslint-disable no-console */
// DEPENDENCIES
const faker = require('faker');
const chai = require('chai');
const chaid = require('chaid');
const { sortBy, omit } = require('lodash');
const dateTime = require('chai-datetime');
const assertArrays = require('chai-arrays');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;

// OPERATIONS
const vendorOps = require('../../lib/db/mongo/operations/vendor-ops');
const regionOps = require('../../lib/db/mongo/operations/region-ops');
const tweetOps = require('../../lib/db/mongo/operations/tweet-ops');
const userOps = require('../../lib/db/mongo/operations/user-ops');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

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
      let user;

      before(async () => {
        await seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          user = await User.findOne({ vendorID: { $exists: true } });
          vendor = await Vendor.findOne({ regionID, _id: user.vendorID });
        });
      });

      it('expect all vendors given a regionID', (done) => {
        vendorOps.getVendors(regionID)
          .then((res) => {
            expect(res).to.be.array();
            expect(res[0].regionID).to.have.same.id(regionID);
            // just testing that it is populating the tweets
            expect(res.every(v => v.tweetHistory.every(tweet => tweet.text))).to.be.true;
            done();
          })
          .catch((err) => {
            console.error(err);
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
            console.error(err);
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
            console.error(err);
            throw err;
          });
      });

      after((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });

    // TODO: add tests for createLocationAndCorrectConflicts
    // UPDATE VENDOR DB OPERATIONS
    describe('Update Vendor Operations', () => {
      let vendor;
      let regionID;
      let locationID;
      let userLocationID;

      beforeEach((done) => {
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendor = await Vendor.findOne({
            regionID: await regionID, 'locationHistory.0': { $exists: true }, 'userLocationHistory.0': { $exists: true },
          });
          locationID = vendor.locationHistory[vendor.locationHistory.length - 1];
          userLocationID = vendor.userLocationHistory[vendor.userLocationHistory.length - 1];
          done();
        });
      });

      it('expect new coordinate object pushed into locationHistory', async () => {
        const coordinatesPayload = { locationDate: new Date('2018-02-18T16:22:00Z'), address: '28 Ist', coordinates: { lat: 1.123, long: 4.523 } };
        const newLocation = await Location.create({ ...coordinatesPayload, TweetID: 'blah', vendorID: vendor._id });


        const prevCoordHist = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.locationHistory);

        const params = {
          regionID, vendorID: vendor._id, field: 'locationHistory', payload: newLocation._id,
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
        expect(updatedCoordHist[updatedCoordHist.length - 1].coordinates.toObject())
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
        // just checking that it populates tweets correctly
        expect(updateCommentsRes.tweetHistory.length).to.be.equal(1);
        expect(updateCommentsRes.tweetHistory.every(tweet => tweet.text)).to.be.true;
      });

      it('expect new tweet to be added to tweetHistory', async () => {
        const tweetPayload = {
          tweetID: '1xtwittera7v2',
          date: new Date('2017-02-18T08:20:00Z'),
          text: 'test tweet',
          locations: [new ObjectId(), new ObjectId()],
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

        const updatedTweetLocations = updatedDailyTweets[updatedDailyTweets.length - 1].locations;

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1]
          .tweetID).to.equal(tweetPayload.tweetID);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].date)
          .to.equalDate(tweetPayload.date);
        expect(updatedTweetLocations.map(location => String(location))).to.deep.equal(tweetPayload.locations.map(location => String(location)));
        expect(updatedDailyTweets.length).to.equal(prevDailyTweets.length + 1);
      });

      it('expect updateVendorSet to update multiple fields in one operation', async () => {
        const newEmail = 'test@gmail.com';
        const newDescription = 'test123';
        const prevVendor = await Vendor.findOne({ _id: vendor._id });

        const params = {
          regionID, vendorID: vendor._id, field: ['description', 'email'], data: [newDescription, newEmail],
        };
        const updatedVendor = await vendorOps.updateVendorSet(params);

        expect(prevVendor.description).to.not.be.equal(newDescription);
        expect(prevVendor.email).to.not.be.equal(newEmail);
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
        const updatedConsecutiveDaysInactive = await vendorOps.updateVendorSet(params)
          .then(vendorUpdated => vendorUpdated.consecutiveDaysInactive);

        // Starts at 4
        expect(prevConsecutiveDaysInactive).to.be.equal(5);
        expect(updatedConsecutiveDaysInactive).to.be.equal(-1);
      });

      it('expect Vendor name to update to Lobster Town', async () => {
        const params = {
          regionID, vendorID: vendor._id, field: 'name', data: 'Lobster Town',
        };
        const updatedName = await vendorOps.updateVendorSet(params)
          .then(vendorUpdated => vendorUpdated.name);

        expect(updatedName).to.be.equal('Lobster Town');
      });

      it('expect closedDate of Vendor to update', async () => {
        const date = new Date('2018-02-18T16:22:00Z');

        const prevClosedDate = await Vendor.findOne({ _id: vendor._id })
          .then(vendorPrev => vendorPrev.closedDate);

        const params = {
          regionID, vendorID: vendor._id, field: 'closedDate', data: date,
        };
        const updatedClosedDate = await vendorOps.updateVendorSet(params)
          .then(vendorUpdated => vendorUpdated.closedDate);

        expect(prevClosedDate).to.be.an('undefined');
        expect(updatedClosedDate).to.equalDate(date);
      });

      afterEach((done) => {
        seed.emptyRegions()
          .then(() => seed.emptyVendors())
          .then(() => done());
      });
    });
  });

  describe('User DB Operations', () => {
    describe('Get User Operations', () => {
      let allUsers; let customer; let customerWithoutARegionId;

      before((done) => {
        seed.runSeed().then(async () => {
          allUsers = await User.find().select('+twitterProvider');
          customer = allUsers.find(user => user.type === 'customer' && user.regionID);
          customerWithoutARegionId = allUsers.find(user => user.type === 'customer' && !user.regionID);
          done();
        });
      });

      it('expect hasAllRequiredFields to be false if a regionID is missing', (done) => {
        userOps.findUserById(customerWithoutARegionId._id)
          .then((res) => {
            expect(res.hasAllRequiredFields).to.be.false;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect hasAllRequiredFields to be true if all fields filled in', (done) => {
        userOps.findUserById(customer._id)
          .then((res) => {
            expect(res.hasAllRequiredFields).to.be.true;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect findUserById to return the user without twitterProvider, if includeTwitterProvider is false', (done) => {
        const customerWithoutTwitterProvider = { ...customer.toJSON(), twitterProvider: undefined };
        userOps.findUserById(customer._id)
          .then((res) => {
            expect(JSON.stringify(res)).to.be.equal(JSON.stringify(customerWithoutTwitterProvider));
            expect(res.twitterProvider).to.be.undefined;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect findUserById to return the user with twitterProvider, if includeTwitterProvider is true', (done) => {
        userOps.findUserById(customer._id, true)
          .then((res) => {
            expect(JSON.stringify(res)).to.be.equal(JSON.stringify(customer));
            expect(JSON.stringify(res.twitterProvider)).to.be.equal(JSON.stringify(customer.twitterProvider));
            done();
          })
          .catch(err => console.error(err));
      });
    });
    describe('Update User Operations', () => {
      const token = '123456789';
      const tokenSecret = '123456789876543';
      const id = faker.random.word();
      const username = 'user name !!';
      const displayName = 'display name';
      const emails = [{ value: 'fake@fake.com' }];
      const profile = {
        id, username, displayName, emails,
      };
      let allUsers; let customer; let randomVendor; let
        vendorWithAVendor;

      beforeEach((done) => {
        seed.runSeed().then(async () => {
          allUsers = await User.find().select('+twitterProvider');
          customer = allUsers.find(user => user.type === 'customer');
          vendorWithAVendor = allUsers.find(user => user.type === 'vendor' && user.vendorID);
          randomVendor = await Vendor.findOne();
          done();
        });
      });

      afterEach((done) => {
        seed.emptyUsers()
          .then(() => seed.seedUsers())
          .then(() => done());
      });

      it('expect patchUser to update every key except the twitterProvider', (done) => {
        const email = 'blah@blah.com';
        const regionID = ObjectId();
        const twitterProvider = { blah: 'blah' };
        userOps.patchUser(customer._id, { email, regionID, twitterProvider })
          .then(async (res) => {
            expect(res.email).to.be.equal(email);
            expect(res.regionID.toString()).to.be.equal(regionID.toString());
            expect(res.twitterProvider).to.be.undefined;
            const updatedUser = await User.findById(customer._id).select('+twitterProvider');
            expect(JSON.stringify(updatedUser.twitterProvider)).to.be.equal(JSON.stringify(customer.twitterProvider));
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect patchUser update the user and does not remove the vendorID if user was a vendor but type not updated', (done) => {
        const email = 'blah@blah.com';
        const regionID = ObjectId();
        userOps.patchUser(vendorWithAVendor._id, { email, regionID })
          .then((res) => {
            expect(res.email).to.be.equal(email);
            expect(res.regionID.toString()).to.be.equal(regionID.toString());
            expect(res.vendorID.toString()).to.be.equal(vendorWithAVendor.vendorID.toString());
            expect(res.twitterProvider).to.be.undefined;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect patchUser update the user and remove the vendorID if data.type && data.type !== vendor', (done) => {
        const email = 'blah@blah.com';
        const regionID = ObjectId();
        const type = 'customer';
        userOps.patchUser(vendorWithAVendor._id, { email, regionID, type })
          .then((res) => {
            expect(res.email).to.be.equal(email);
            expect(res.type).to.be.equal(type);
            expect(res.regionID.toString()).to.be.equal(regionID.toString());
            expect(res.vendorID).to.be.undefined;
            expect(res.twitterProvider).to.be.undefined;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect upsertTwitterUser creates user does not already exist', (done) => {
        const type = 'customer';
        userOps.upsertTwitterUser(token, tokenSecret, profile, type)
          .then(async (res) => {
            expect(res.user.twitterProvider).to.be.undefined;
            const newUser = await User.findById(res.user._id).select('+twitterProvider');
            expect(newUser.type).to.be.equal(type);
            expect(newUser.email).to.be.equal(profile.emails[0].value);
            expect(JSON.stringify(newUser.twitterProvider)).to.be.equal(JSON.stringify({
              id,
              token,
              tokenSecret,
              username,
              displayName,
            }));
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect upsertTwitterUser creates user does not already exist and adds vendorID if there is a match', (done) => {
        const type = 'customer';
        const vendorProfile = { ...profile, id: randomVendor.twitterID };
        userOps.upsertTwitterUser(token, tokenSecret, vendorProfile, type)
          .then(async (res) => {
            expect(res.user.twitterProvider).to.be.undefined;
            const newUser = await User.findById(res.user._id).select('+twitterProvider');
            expect(newUser.type).to.be.equal(type);
            expect(newUser.email).to.be.equal(profile.emails[0].value);
            expect(newUser.vendorID.toString()).to.be.equal(randomVendor._id.toString());
            expect(JSON.stringify(newUser.twitterProvider)).to.be.equal(JSON.stringify({
              id: randomVendor.twitterID,
              token,
              tokenSecret,
              username,
              displayName,
            }));
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect upsertTwitterUser finds a user if it already exists', (done) => {
        const type = 'customer';
        const customerWithoutTwitterProvider = { ...customer.toJSON(), twitterProvider: undefined };
        const vendorProfile = { ...profile, id: customer.twitterProvider.id };
        userOps.upsertTwitterUser(token, tokenSecret, vendorProfile, type)
          .then(async (res) => {
            expect(res.user.twitterProvider).to.be.undefined;
            expect(JSON.stringify(res.user)).to.be.equal(JSON.stringify(customerWithoutTwitterProvider));
            done();
          })
          .catch(err => console.error(err));
      });
    });
  });

  // REGION DB OPERATIONS
  describe('Region DB Operations', () => {
    // GET REGION DB OPERATIONS
    describe('Get Region Operations', () => {
      let regionID; let
        allRegions;

      before((done) => {
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          allRegions = await Region.find({});
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

      it('expect getAllRegions to return all Regions', (done) => {
        regionOps.getAllRegions()
          .then((res) => {
            expect(JSON.stringify(res)).to.be.equal(JSON.stringify(allRegions));
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
  });

  describe('Tweet DB Operations', () => {
    let regionID; let vendor; let allTweets; let allVendors; let locationID; let tweetID; let
      tweet;

    beforeEach((done) => {
      seed.runSeed().then(async () => {
        regionID = await Region.findOne().then(region => region._id);
        vendor = await Vendor.findOne({ regionID: await regionID });
        allTweets = await Tweet.find().sort([['date', 1]]);
        allVendors = await Vendor.find().populate('tweetHistory').lean();
        [tweetID] = vendor.tweetHistory;
        tweet = await Tweet.findById(tweetID).populate('locations').populate('vendorID');
        // note: locationId should be equal to vendor.locationHistory[0]
        locationID = tweet.locations[0]._id;
        done();
      });
    });

    afterEach((done) => {
      seed.emptySeed()
        .then(() => done());
    });

    describe('Get Tweet Operations', () => {
      it('expect getAllTweets to return empty arary if no query passed', (done) => {
        tweetOps.getAllTweets()
          .then((res) => {
            expect(res).to.be.array();
            expect(res.length).to.be.equal(0);
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect getAllTweets to return all if date range wide enough; must populate location', (done) => {
        const startDate = allTweets[0].date;
        const endDate = allTweets[allTweets.length - 1].date;
        tweetOps.getAllTweets({ startDate, endDate })
          .then((res) => {
            expect(res).to.be.array();
            expect(res.length).to.be.equal(allTweets.length);
            expect(res.every(tweet => tweet.locations.every(location => location.coordinates))).to.be.true;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect getAllTweets to filter by vendorID if passed', (done) => {
        const { vendorID } = allTweets[0];
        tweetOps.getAllTweets({ vendorID })
          .then((res) => {
            expect(res.every(tweet => tweet.vendorID === vendorID)).to.be.true;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect getVendorsForFiltering to select name, id, and tweetHistory for all vendors and sort by name', (done) => {
        tweetOps.getVendorsForFiltering()
          .then((res) => {
            expect(res).to.be.array();
            expect(res.length).to.be.equal(allVendors.length);
            expect(JSON.stringify(res)).to.be.equal(JSON.stringify(sortBy(allVendors.map(v => ({ _id: v._id, tweetHistory: v.tweetHistory, name: v.name })), 'name')));
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect getTweetWithPopulatedVendorAndLocation to find tweet by ID and populate location and vendorID', (done) => {
        tweetOps.getTweetWithPopulatedVendorAndLocations(tweetID)
          .then((res) => {
            expect(JSON.stringify(res)).to.be.equal(JSON.stringify(tweet));
            done();
          })
          .catch(err => console.error(err));
      });
    });

    describe('Update Tweet Operations', () => {
      it('expect deleteTweetLocation to delete old tweet location', (done) => {
        Tweet.updateOne({ _id: tweetID }, { date: new Date() }).then(() => {
          tweetOps.deleteTweetLocation(tweetID, locationID)
            .then(async (res) => {
              // populates vendorID in the response
              expect(res.vendorID.name).to.deep.equal(vendor.name);
              expect(res.locations).to.deep.equal([]);
              expect(res.usedForLocation).to.be.false;
              const updatedLocation = await Location.findById(locationID);
              expect(updatedLocation.overridden).to.be.true;
              const updatedVendor = await Vendor.findById(vendor._id);
              expect(updatedVendor.locationHistory.find(location => location.toString() === tweetID.toString())).to.be.an('undefined');
              done();
            })
            .catch(err => console.error(err));
        });
      });

      it('expect createTweetLocation to delete old tweet location if locationToOverride is passed, create new tweet, and update as appropriate', (done) => {
        const locationDate = new Date();
        const locationToOverride = tweet.locations[0].toObject();
        const newLocationData = {
          ...locationToOverride, locationToOverride, locationDate, coordinates: { lat: 0, long: 0 }, _id: undefined,
        };
        tweetOps.createTweetLocation(tweetID, newLocationData)
          .then(async (res) => {
            // populates vendorID in the response
            expect(res.vendorID.name).to.be.equal(vendor.name);
            expect(res.usedForLocation).to.be.true;
            const updatedLocation = await Location.findById(locationID);
            const newLocation = await Location.findById(res.locations[0]);
            expect(JSON.stringify(newLocation.toObject())).to.deep.equal(JSON.stringify({ ...omit(newLocationData, ['locationToOverride']), _id: newLocation._id, matchMethod: 'Manual from Tweet' }));
            expect(updatedLocation.overridden).to.be.true;
            const updatedVendor = await Vendor.findById(vendor._id);
            expect(!!updatedVendor.locationHistory.find(location => location.toString() === tweetID.toString())).to.be.false;
            expect(!!updatedVendor.locationHistory.find(location => location.toString() === res.locations[0]._id.toString())).to.be.true;
            done();
          })
          .catch(err => console.error(err));
      });

      it('expect createTweetLocation to create new tweet, and update as appropriate', (done) => {
        const newLocationData = { ...tweet.locations[0].toObject(), coordinates: { lat: 0, long: 0 }, _id: undefined };
        tweetOps.createTweetLocation(tweetID, newLocationData)
          .then(async (res) => {
            // populates vendorID in the response
            expect(res.vendorID.name).to.be.equal(vendor.name);
            expect(res.usedForLocation).to.be.true;
            const newLocation = await Location.findById(res.locations[res.locations.length - 1]);
            expect(JSON.stringify(newLocation.toObject())).to.deep.equal(JSON.stringify({
              ...newLocationData,
              _id: newLocation._id,
              matchMethod: 'Manual from Tweet',
            }));
            const updatedVendor = await Vendor.findById(vendor._id);
            expect(!!updatedVendor.locationHistory.find(location => location.toString() === res.locations[0]._id.toString())).to.be.true;
            done();
          })
          .catch(err => console.error(err));
      });
    });
  });
});
