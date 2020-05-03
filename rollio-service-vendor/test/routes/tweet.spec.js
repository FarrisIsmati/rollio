// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const queryString = require('query-string');
const jwt = require('jsonwebtoken');
const moment = require('moment');
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
  let tweet;
  let newLocationData;

  beforeEach((done) => {
    seed.runSeed().then(async () => {
      vendors = await Vendor.find({}).select('_id name').sort([['name', 1]]);
      tweets = await Tweet.find({}).sort([['date', -1]]);
      tweet = tweets.find(x => x.locations.length);
      const allUsers = await User.find();
      customer = allUsers.find(user => user.type === 'customer');
      customerToken = jwt.sign({
        id: customer._id,
      }, JWT_SECRET, { expiresIn: 60 * 60 });
      admin = allUsers.find(user => user.type === 'admin');
      adminToken = jwt.sign({
        id: admin._id,
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
              expect(res.body.tweets.map(tweet => String(tweet._id))).to.deep.equal(tweets.map(tweet => String(tweet._id)));
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
              expect(res.body.tweets.every(tweet => moment(tweet.date).isSame(momentifiedEarliestDate, 'day'))).to.be.true;
              done();
            });
        });
      });

      describe('/tweets/filter with vendorId', () => {
        it('expect to get tweets from that vendor only', (done) => {
          const endDate = new Date();
          const startDate = new Date(tweets[0].date);
          const vendorID = vendors[0]._id;
          const query = queryString.stringify({ endDate, startDate, vendorID });
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

      describe('/tweets/vendors with authorization', () => {
        it('expect to get back vendors in alphabetical order - but just id and name', (done) => {
          chai.request(server)
            .get('/tweets/vendors')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.deep.equal({ vendors: vendors.map(vendor => ({ _id: String(vendor._id), name: vendor.name })) });
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
            .patch(`/tweets/deletelocation/${tweet._id}`)
            .end((err, res) => {
              expect(res).to.have.status(403);
              done();
            });
        });
      });

      describe('/tweets/deletelocation/:tweetId as a customer only', () => {
        it('expect error', (done) => {
          chai.request(server)
            .patch(`/tweets/deletelocation/${tweet._id}`)
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
            .patch(`/tweets/deletelocation/${tweet._id}`)
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
