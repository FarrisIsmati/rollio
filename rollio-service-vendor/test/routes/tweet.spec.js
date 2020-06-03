// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const queryString = require('query-string');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { sortBy } = require('lodash');
const mongoose = require('../../lib/db/mongo/mongoose/index');
const { app: server } = require('../../index');
const { JWT_SECRET } = require('../../config');

const { expect } = chai;

// SEED
const seed = require('../../lib/db/mongo/seeds/dev-seed');

// SCHEMAS
const Vendor = mongoose.model('Vendor');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

chai.use(chaiHttp);

describe('Tweet Routes', () => {
  let vendors;
  let tweets;
  let customer;
  let customerToken;
  let admin;
  let adminToken;
  let vendor;
  let vendorToken;
  let tweet;
  let newLocationData;
  let locationId;

  beforeEach((done) => {
    seed.runSeed().then(async () => {
      const allUsers = await User.find().lean();
      vendors = await Vendor.find().populate('tweetHistory').lean();
      tweets = await Tweet.find({}).sort([['date', -1]]).lean();
      tweet = tweets.find(x => x.locations.length && allUsers.find(user => String(user.vendorID) === String(x.vendorID)));
      [locationId] = tweet.locations;
      customer = allUsers.find(user => user.type === 'customer');
      customerToken = jwt.sign({
        id: customer._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      admin = allUsers.find(user => user.type === 'admin');
      adminToken = jwt.sign({
        id: admin._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      vendor = allUsers.find(user => user.type === 'vendor' && String(user.vendorID) === String(tweet.vendorID));
      vendorToken = jwt.sign({
        id: vendor._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      newLocationData = {
        vendorID: mongoose.Types.ObjectId(),
        locationDate: new Date(),
        tweetID: tweet._id,
        address: '123 street',
        city: 'washington, dc',
        coordinates: {
          long: 45,
          lat: 45,
        },
      };
      done();
    });
  });

  describe('GET ROUTES', () => {
    describe('FILTER', () => {
      describe('/tweets/filter without authorization', () => {
        it('expect error', (done) => {
          chai.request(server)
            .get('/tweets/filter')
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/filter as a customer only', () => {
        it('expect error', (done) => {
          chai.request(server)
            .get('/tweets/filter')
            .set('Authorization', `Bearer ${customerToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/filter as a vendor only', () => {
        it('expect to get only tweets for that vendor', (done) => {
          const endDate = new Date();
          const startDate = new Date(tweets[tweets.length - 1].date);
          const query = queryString.stringify({ endDate, startDate });
          chai.request(server)
            .get(`/tweets/filter/?${query}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.tweets.map(t => String(t._id))).to.deep.equal(tweets.filter(t => String(t.vendorID) === String(vendor.vendorID)).map(t => String(t._id)));
              done();
            });
        });
      });

      describe('/tweets/filter if no dates specified', () => {
        it('expect to get empty array', (done) => {
          chai.request(server)
            .get('/tweets/filter')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.deep.equal({ tweets: [] });
              done();
            });
        });
      });

      describe('/tweets/filter with dates specified', () => {
        it('expect to get tweets between dates (broadest date range)', (done) => {
          const endDate = new Date();
          const startDate = new Date(tweets[tweets.length - 1].date);
          const query = queryString.stringify({ endDate, startDate });
          chai.request(server)
            .get(`/tweets/filter/?${query}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.tweets.map(t => String(t._id))).to.deep.equal(tweets.map(t => String(t._id)));
              done();
            });
        });
      });

      describe('/tweets/filter with dates specified', () => {
        it('expect to get tweets between dates (narrow date range)', (done) => {
          const earliestDate = new Date(tweets[tweets.length - 1].date);
          const query = queryString.stringify({ endDate: earliestDate, startDate: earliestDate });
          chai.request(server)
            .get(`/tweets/filter/?${query}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              const momentifiedEarliestDate = moment(earliestDate);
              expect(res.body.tweets.every(t => moment(t.date).isSame(momentifiedEarliestDate, 'day'))).to.be.true;
              done();
            });
        });
      });

      describe('/tweets/filter with vendorId', () => {
        it('expect to get tweets from that vendor only', (done) => {
          const endDate = new Date();
          const earliestDate = new Date(tweets[tweets.length - 1].date);
          const vendorID = vendors[0]._id;
          const query = queryString.stringify({ endDate, startDate: earliestDate, vendorID });
          chai.request(server)
            .get(`/tweets/filter/?${query}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.tweets.map(x => String(x._id))).to.deep.equal(tweets.filter(x => String(x.vendorID) === String(vendorID)).map(x => String(x._id)));
              done();
            });
        });
      });
    });

    describe('VENDORS', () => {
      describe('/tweets/vendors without authorization', () => {
        it('expect to error', (done) => {
          chai.request(server)
            .get('/tweets/vendors')
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/vendors as a customer only', () => {
        it('expect to error', (done) => {
          chai.request(server)
            .get('/tweets/vendors')
            .set('Authorization', `Bearer ${customerToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/vendors as vendor', () => {
        it('expect to get back only the vendor him/herself', (done) => {
          chai.request(server)
            .get('/tweets/vendors')
            .set('Authorization', `Bearer ${vendorToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(JSON.stringify(res.body.vendors)).to.be.equal(JSON.stringify(vendors.filter(v => String(v._id) === String(vendor.vendorID)).map(v => ({ _id: v._id, tweetHistory: v.tweetHistory, name: v.name }))));
              done();
            });
        });
      });

      describe('/tweets/vendors with authorization', () => {
        it('expect to get back vendors in alphabetical order - but just id name and tweetHistory', (done) => {
          chai.request(server)
            .get('/tweets/vendors')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(JSON.stringify(res.body.vendors)).to.be.equal(JSON.stringify(sortBy(vendors.map(v => ({ _id: v._id, tweetHistory: v.tweetHistory, name: v.name })), 'name')));
              done();
            });
        });
      });
    });

    describe('USE TWEET', () => {
      describe('/tweets/usetweet/:tweetId without authorization', () => {
        it('expect error', (done) => {
          chai.request(server)
            .get(`/tweets/usetweet/${tweet._id}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/usetweet/:tweetId as a customer only', () => {
        it('expect error', (done) => {
          chai.request(server)
            .get(`/tweets/usetweet/${tweet._id}`)
            .set('Authorization', `Bearer ${customerToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/usetweet/:tweetId as wrong vendor', () => {
        it('expect error', (done) => {
          chai.request(server)
            .get(`/tweets/usetweet/${tweets.find(t => String(t.vendorID) !== String(vendor.vendorID))._id}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/usetweet/:tweetId as correct vendor', () => {
        it('expect success if vendor is the same', (done) => {
          chai.request(server)
            .get(`/tweets/usetweet/${tweets.find(t => String(t.vendorID) === String(vendor.vendorID))._id}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              // full funcationality for 'usetweet' tested in db-operations.js
              expect(!!res.body.tweet).to.be.true;
              done();
            });
        });
      });

      describe('/tweets/usetweet/:tweetId as an admin', () => {
        it('expect success', (done) => {
          chai.request(server)
            .get(`/tweets/usetweet/${tweet._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              // full funcationality for 'usetweet' tested in db-operations.js
              expect(!!res.body.tweet).to.be.true;
              done();
            });
        });
      });
    });
  });

  describe('PATCH ROUTES', () => {
    describe('DELETE LOCATION', () => {
      describe('/tweets/deletelocation/:tweetId without authorization', () => {
        it('expect error', (done) => {
          chai.request(server)
            .patch(`/tweets/deletelocation/${tweet._id}/${locationId}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/deletelocation/:tweetId as a customer only', () => {
        it('expect error', (done) => {
          chai.request(server)
            .patch(`/tweets/deletelocation/${tweet._id}/${locationId}`)
            .set('Authorization', `Bearer ${customerToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/deletelocation/:tweetId as an admin', () => {
        it('expect success', (done) => {
          chai.request(server)
            .patch(`/tweets/deletelocation/${tweet._id}/${locationId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              // full funcationality for 'deleteTweetLocation' tested in db-operations.js
              expect(!!res.body.tweet).to.be.true;
              done();
            });
        });
      });
    });
  });

  describe('POST ROUTES', () => {
    describe('CREATE NEW LOCATION', () => {
      describe('/tweets/createnewlocation/:tweetId without authorization', () => {
        it('expect error', (done) => {
          chai.request(server)
            .post(`/tweets/createnewlocation/${tweet._id}`)
            .send(newLocationData)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/createnewlocation/:tweetId as a customer only', () => {
        it('expect error', (done) => {
          chai.request(server)
            .post(`/tweets/createnewlocation/${tweet._id}`)
            .send(newLocationData)
            .set('Authorization', `Bearer ${customerToken}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/createnewlocation/:tweetId as an admin', () => {
        it('expect success', (done) => {
          chai.request(server)
            .post(`/tweets/createnewlocation/${tweet._id}`)
            .send(newLocationData)
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              // full funcationality for 'createnewlocation' tested in db-operations.js
              expect(!!res.body.tweet).to.be.true;
              done();
            });
        });
      });
    });
  });


  afterEach((done) => {
    seed.emptySeed()
      .then(() => done());
  });
});
