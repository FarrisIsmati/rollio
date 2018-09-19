//DEPENDENCIES
const mongoose            = require('../../controllers/db/schemas/AllSchemas');
const chai                = require('chai');
const chaid               = require('chaid');
const dateTime            = require('chai-datetime');
const assertArrays        = require('chai-arrays');
const expect              = chai.expect;

//OPERATIONS
const vendorOperations    = require('../../controllers/db/operations/vendorOperations');
const regionOperations    = require('../../controllers/db/operations/regionOperations');

//SCHEMAS
const Vendor              = mongoose.model('Vendor');
const Region              = mongoose.model('Region');

//SEED
const seed                = require('../../controllers/db/seeds/developmentSeed');

//CHAI ADD-ONS
chai.use(chaid);
chai.use(assertArrays);
chai.use(dateTime);

describe('DB Operations', function() {
  describe('Vendor DB Operations', function() {
    //GET VENDOR DB OPERATIONS
    describe('Get Vendor Operations', function() {
      let regionID;
      let vendor;

      before(function(done){
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendor = await Vendor.findOne({"regionID": await regionID});
          done();
        });
      });

      it('should return all vendors given a regionID', function(done) {
        vendorOperations.getVendors(regionID)
        .then(res => {
          expect(res).to.be.array();
          expect(res[0].regionID).to.have.same.id(regionID);
          done();
        })
        .catch(err => console.log(err));
      });

      it('should return a vendor given a regionID and a objectID', function(done) {
        vendorOperations.getVendor(regionID, vendor._id)
        .then(res => {
          expect(res).to.have.same.id(vendor)
          done();
        })
        .catch(err => console.log(err));
      });

      it('expect a vendor given an object with a set of mongo query parameters', function(done) {
        const params = {
          regionID,
          consecutiveDaysInactive: 0
        }
        vendorOperations.getVendorsByQuery(params)
        .then(res => {
          expect(res.length).to.be.equal(3);
          for (let i = 0; i < res.length; i++) {
            expect(parseInt(res[i].consecutiveDaysInactive)).to.be.equal(0);
          }
          done();
        })
        .catch(err => console.log(err));
      });

      after(function(done) {
        seed.emptyRegions()
        .then(() => seed.emptyVendors())
        .then(() => done());
      });
    });

    //UPDATE VENDOR DB OPERATIONS
    describe('Update Vendor Operations', function() {
      let vendor;
      let regionID;

      beforeEach(function(done){
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          vendor = await Vendor.findOne({"regionID": await regionID});
          done();
        });
      });

      it('should push new coordinate object into coordinatesHistory', async function() {
        const coordinatesPayload = { coordinatesDate: new Date("2018-02-18T16:22:00Z"), address: "28 Ist", coordinates:[1.123,4.523] };

        const prevCoordHist = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.coordinatesHistory);

        const params = { regionID, vendorID: vendor._id, field: 'coordinatesHistory',  payload: coordinatesPayload };
        const updateCoordHistRes = await vendorOperations.updateVendorPush(params)
        .then(res => res);

        const updatedCoordHist = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.coordinatesHistory);

        expect(updateCoordHistRes.nModified).to.equal(1);
        expect(updatedCoordHist[updatedCoordHist.length - 1].coordinatesDate).to.equalDate(coordinatesPayload.coordinatesDate);
        expect(updatedCoordHist[updatedCoordHist.length - 1].address).to.deep.equal(coordinatesPayload.address);
        expect(updatedCoordHist[updatedCoordHist.length - 1].coordinates).to.deep.equal(coordinatesPayload.coordinates);
        expect(updatedCoordHist.length).to.equal(prevCoordHist.length + 1);
      });

      it('should push new tweet object into tweetsDaily', async function() {
        const tweetPayload = {
          "tweetID": "1xtwittera7v2",
          "createdAt": new Date("2017-02-18T08:20:00Z"),
          "text": "test tweet",
          "userID": "Khlav Kalash",
          "userScreenName": "Khlav Kalash Crab Juice",
          "geolocation": {
            "coordinatesDate": new Date("2017-02-18T08:20:00Z"),
            "coordinates": [38.24561, -77.86542]
          }
        };

        const prevDailyTweets = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.tweetsDaily);

        const params = { regionID, vendorID: vendor._id, field: 'tweetsDaily',  payload: tweetPayload };
        const updateDailyTweetsRes = await vendorOperations.updateVendorPush(params)
        .then(res => res);

        const updatedDailyTweets = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.tweetsDaily);

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].tweetID).to.equal(tweetPayload.tweetID);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].createdAt).to.equalDate(tweetPayload.createdAt);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].geolocation.coordinatesDate).to.deep.equal(tweetPayload.geolocation.coordinatesDate);
        expect(updatedDailyTweets.length).to.equal(prevDailyTweets.length + 1);
      });

      it('should empty tweetsDaily collection', async function() {
        const prevDailyTweets = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.tweetsDaily);

        const updateDailyTweetsRes = await vendorOperations.emptyVendorTweets(regionID, vendor._id)
        .then(res => res);

        const updatedDailyTweets = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.tweetsDaily);

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets.length).to.equal(0);
      });

      it('should set dailyActive from false to true', async function() {
        const prevDailyActive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.dailyActive);

        const params = { regionID, vendorID: vendor._id, field: 'dailyActive',  data: true };
        const updateDailyActiveRes = await vendorOperations.updateVendorSet(params)
        .then(res => res);

        const updatedDailyActive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.dailyActive);

        expect(prevDailyActive).to.be.false;
        expect(updateDailyActiveRes.nModified).to.equal(1);
        expect(updatedDailyActive).to.be.true;
      });

      it('should update locationAccuracy by incrementing value by one', async function() {
        const prevLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationAccuracy);

        const updateLocationAccuracy = await vendorOperations.updateLocationAccuracy({regionID, vendorID: vendor._id, amount: 1});

        const updatedLocationAccuracy = await Vendor.findOne({"_id": vendor._id})
        .then(vendor => vendor.locationAccuracy);

        expect(updateLocationAccuracy.nModified).to.equal(1);
        expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy + 1);
      });

      it('should update locationAccuracy by decrementing value by one', async function() {
        const prevLocationAccuracy = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.locationAccuracy);

        const updateLocationAccuracy = await vendorOperations.updateLocationAccuracy({regionID, vendorID: vendor._id, amount: -1});

        const updatedLocationAccuracy = await Vendor.findOne({"_id": vendor._id})
        .then(vendor => vendor.locationAccuracy);

        expect(updateLocationAccuracy.nModified).to.equal(1);
        expect(updatedLocationAccuracy).to.equal(prevLocationAccuracy - 1);
      });

      it('should update consecutiveDaysInactive by incrementing value by one', async function() {
        const prevConsecutiveDaysInactive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.consecutiveDaysInactive);

        const updateConsecutiveDaysInactiveRes = await vendorOperations.incrementVendorConsecutiveDaysInactive(regionID, vendor._id)
        .then(res => res);

        const updatedConsecutiveDaysInactive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.consecutiveDaysInactive);

        expect(updateConsecutiveDaysInactiveRes.nModified).to.equal(1);
        expect(updatedConsecutiveDaysInactive).to.be.equal(prevConsecutiveDaysInactive + 1);
      });

      it('should reset consecutiveDaysInactive to 0', async function() {
        const incrementConsecutiveDaysInactiveRes = await vendorOperations.incrementVendorConsecutiveDaysInactive(regionID, vendor._id)
        .then(res => res);

        const prevConsecutiveDaysInactive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.consecutiveDaysInactive);

        const params = { regionID, vendorID: vendor._id, field: 'consecutiveDaysInactive',  data: 0 };
        const updateConsecutiveDaysInactiveRes = await vendorOperations.updateVendorSet(params)
        .then(res => res);

        const updatedConsecutiveDaysInactive = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.consecutiveDaysInactive);

        expect(prevConsecutiveDaysInactive).to.be.equal(1);
        expect(updateConsecutiveDaysInactiveRes.nModified).to.equal(1);
        expect(updatedConsecutiveDaysInactive).to.be.equal(0);
      });

      it('should update name of Vendor to Lobster Town', async function() {
        const prevName = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.name);

        const params = { regionID, vendorID: vendor._id, field: 'name',  data: 'Lobster Town' };
        const updateNameRes = await vendorOperations.updateVendorSet(params)
        .then(res => res);

        const updatedName = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.name);

        expect(updateNameRes.nModified).to.equal(1);
        expect(updatedName).to.be.equal('Lobster Town');
      });

      it('should update closedDate of Vendor', async function() {
        const date = new Date("2018-02-18T16:22:00Z");

        const prevClosedDate = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.closedDate);

        const params = { regionID, vendorID: vendor._id, field: 'closedDate',  data: date };
        const updateClosedDateRes = await vendorOperations.updateVendorSet(params)
        .then(res => res);

        const updatedClosedDate = await Vendor.findOne({ "_id": vendor._id })
        .then(vendor => vendor.closedDate);

        expect(prevClosedDate).to.be.an('undefined');
        expect(updateClosedDateRes.nModified).to.equal(1);
        expect(updatedClosedDate).to.equalDate(date);
      });

      afterEach(function(done) {
        seed.emptyRegions()
        .then(() => seed.emptyVendors())
        .then(() => done());
      });
    });
  });

  //REGION DB OPERATIONS
  describe('Region DB Operations', function() {
    //GET REGION DB OPERATIONS
    describe('Get Region Operations', function() {
      let regionID;

      before(function(done){
        seed.runSeed().then(async () => {
          regionID = await Region.findOne().then(region => region._id);
          done();
        });
      });

      it('should return a region given a regionID', function(done) {
        regionOperations.getRegion(regionID)
        .then(res => {
          expect(res._id).to.have.same.id(regionID);
          done();
        })
        .catch(err => console.log(err));
      });

      after(function(done) {
        seed.emptyRegions()
        .then(() => seed.emptyVendors())
        .then(() => done());
      });
    });
  });

});
