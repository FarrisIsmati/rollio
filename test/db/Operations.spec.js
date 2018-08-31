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
      let testVendorObj;
      let regionID;

      before(function(done){
        seed.runSeed().then(async () => {
          regionID = await Region.collection.findOne().then(region => region._id);
          testVendorObj = await Vendor.collection.findOne({"regionID": await regionID});
          done();
        });
      });

      it('should return all vendors given a regionID', function(done) {
        vendorOperations.getVendors(regionID)
        .then(res => {
          expect(res).to.be.array();
          expect(res[0].regionID).have.same.id(regionID);
          done();
        })
        .catch(err => console.log(err));
      });

      it('should return a vendor given a regionID and a objectID', function(done) {
        vendorOperations.getVendor(regionID, testVendorObj._id)
        .then(res => {
          expect(res).have.same.id(testVendorObj)
          done();
        })
        .catch(err => console.log(err));
      });

      after(function(done) {
        seed.emptyRegionsCollection()
        .then(() => seed.emptyVendors())
        .then(() => done());
      });
    });

    //UPDATE VENDOR DB OPERATIONS
    describe('Update Vendor Operations', function() {
      let testVendorObj;
      let regionID;

      beforeEach(function(done){
        seed.runSeed().then(async () => {
          regionID = await Region.collection.findOne().then(region => region._id);
          testVendorObj = await Vendor.collection.findOne({"regionID": await regionID});
          done();
        });
      });

      it('should push new coordinate object into coordinatesHistory', async function() {
        const coordinatesPayload = { coordinatesDate: new Date("2018-02-18T16:22:00Z"), coordinates:[1.123,4.523] };

        const prevCoordHist = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.coordinatesHistory);

        const updateCoordHistRes = await vendorOperations.updateVendorPush(regionID, testVendorObj._id, 'coordinatesHistory',  coordinatesPayload)
        .then(res => res);

        const updatedCoordHist = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.coordinatesHistory);

        expect(updateCoordHistRes.nModified).to.equal(1);
        expect(updatedCoordHist[updatedCoordHist.length - 1].coordinatesDate).to.equalDate(coordinatesPayload.coordinatesDate);
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

        const prevDailyTweets = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.tweetsDaily);

        const updateDailyTweetsRes = await vendorOperations.updateVendorPush(regionID, testVendorObj._id, 'tweetsDaily',  tweetPayload)
        .then(res => res);

        const updatedDailyTweets = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.tweetsDaily);

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].tweetID).to.equal(tweetPayload.tweetID);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].createdAt).to.equalDate(tweetPayload.createdAt);
        expect(updatedDailyTweets[updatedDailyTweets.length - 1].geolocation.coordinatesDate).to.deep.equal(tweetPayload.geolocation.coordinatesDate);
        expect(updatedDailyTweets.length).to.equal(prevDailyTweets.length + 1);
      });

      it('should empty tweetsDaily collection', async function() {
        const prevDailyTweets = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.tweetsDaily);

        const updateDailyTweetsRes = await vendorOperations.emptyVendorTweets(regionID, testVendorObj._id)
        .then(res => res);

        const updatedDailyTweets = await Vendor.collection.findOne({ "_id": testVendorObj._id })
        .then(vendor => vendor.tweetsDaily);

        expect(updateDailyTweetsRes.nModified).to.equal(1);
        expect(updatedDailyTweets.length).to.equal(0);
      });

      afterEach(function(done) {
        seed.emptyRegionsCollection()
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
          regionID = await Region.collection.findOne().then(region => region._id);
          done();
        });
      });

      it('should return a region given a regionID', function(done) {
        regionOperations.getRegion(regionID)
        .then(res => {
          expect(res._id).have.same.id(regionID);
          done();
        })
        .catch(err => console.log(err));
      });

      after(function(done) {
        seed.emptyRegionsCollection()
        .then(() => seed.emptyVendors())
        .then(() => done());
      });
    });
  });

});
