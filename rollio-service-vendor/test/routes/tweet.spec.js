// DEPENDENCIES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('../../lib/db/mongo/mongoose/index');
const server = require('../../index');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const queryString = require('query-string');
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
    let token;
    let user;

    beforeEach((done) => {
        seed.runSeed().then(async () => {
            vendors = await Vendor.find({}).select('_id name').sort([['name', 1]]);
            tweets = await Tweet.find({}).sort([['date', -1]]);
            user = await User.create({ email: 'fake@fake.com' });
            token = jwt.sign({
                id: user._id
            }, JWT_SECRET, { expiresIn: 60 * 60 });
            done();
        });
    });

    describe('GET ALL VENDORS', () => {
        describe('/tweets/filter without authorization', () => {
            it('expect error', (done) => {
                chai.request(server)
                    .get(`/tweets/filter`)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('/tweets/filter if no dates specified', () => {
            it('expect to get empty array', (done) => {
                chai.request(server)
                    .get(`/tweets/filter`)
                    .set( 'Authorization', `Bearer ${token}` )
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.deep.equal({ tweets: [] });
                        done();
                    });
            });
        });

        // TODO: update this test to really test dates
        describe('/tweets/filter with dates specified', () => {
            it('expect to get tweets between dates', (done) => {
                const endDate = new Date();
                const startDate = new Date(tweets[0].date);
                const query = queryString.stringify({endDate, startDate});
                chai.request(server)
                    .get(`/tweets/filter/?${query}`)
                    .set( 'Authorization', `Bearer ${token}` )
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.tweets.map(tweet => String(tweet._id))).to.deep.equal(tweets.map(tweet => String(tweet._id)));
                        done();
                    });
            });
        });

        describe('/tweets/filter with vendorId', () => {
            it('expect to get tweets from that vendor only', (done) => {
                const endDate = new Date();
                const startDate = new Date(tweets[0].date);
                const vendorID = vendors[0]._id
                const query = queryString.stringify({endDate, startDate, vendorID});
                chai.request(server)
                    .get(`/tweets/filter/?${query}`)
                    .set( 'Authorization', `Bearer ${token}` )
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.tweets.map(tweet => String(tweet._id))).to.deep.equal(tweets.filter(tweet => String(tweet.vendorID) === String(vendorID)).map(tweet => String(tweet._id)));
                        done();
                    });
            });
        });



        describe('/tweets/vendors with authorization', () => {
            it('expect to get back vendors in alphabetical order - but just id and name', (done) => {
                chai.request(server)
                    .get(`/tweets/vendors`)
                    .set( 'Authorization', `Bearer ${token}` )
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.deep.equal({vendors: vendors.map(vendor => ({_id: String(vendor._id), name: vendor.name}))});
                        done();
                    });
            });
        });

        describe('/tweets/vendors without authorization', () => {
            it('expect to error', (done) => {
                chai.request(server)
                    .get(`/tweets/vendors`)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });


        afterEach((done) => {
            seed.emptySeed()
                .then(() => done());
        });
    });
});
