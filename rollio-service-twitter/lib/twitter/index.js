/* eslint-disable no-console */
// DEPENDENCIES
const Twitter = require('twitter');
const config = require('../../config');
const logger = require('../log/index')('twitter/index');

// LIB
const tweetParser = require('./parse/tweet-parser');
const locationOps = require('../bin/location-ops');
const sendParsedTweet = require('../messaging/send/send-parsed-tweet');

const client = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN,
  access_token_secret: config.TWITTER_ACCESS_SECRET,
});

const twitter = {
  stream: null,
  vendorList: '',
  connectAtt: 0,
  backoffTime: 3,
  async streamClient(vendorList, tstIDs = '1053649707493404678') {
    if (config.NODE_ENV === 'TEST_LOCAL' || config.NODE_ENV === 'TEST_DOCKER') {
      this.vendorList = tstIDs;
    } else {
      this.vendorList = vendorList;
    }

    this.connect();

    return this.stream;
  },
  async connect(tstIDs = '1053649707493404678') {
    if (!this.vendorList.length) {
      this.vendorList = tstIDs;
    }

    this.stream = client.stream('statuses/filter', { follow: this.vendorList });

    this.connectAtt += 1;

    this.stream.on('connected', (e) => {
      logger.info(`Twitter: Connected ${e}`);
    });

    this.stream.on('data', async (e) => {
      const formattedTweet = await this.tweetFormatter(e);
      const parsedTweet = await tweetParser.scanAddress(formattedTweet);
      logger.info('Received Tweet');
      logger.info(parsedTweet);
      // TODO: Fix later
      //  this is a temporary hack until tweetParser can decipher multiple locations from one tweet
      await sendParsedTweet({ ...parsedTweet, newLocations: [parsedTweet.location], location: undefined });
    });

    // Exponential backoff upon failure of stream up to 8 retries before shutting down
    this.stream.on('error', (err) => {
      this.stream.destroy();
      if (this.connectAtt < 8) {
        logger.error('Twitter: Connection failed trying again`');
        logger.error(err);
        this.backoff(this.backoffTime);
        logger.error(`attempts: ${this.connectAtt}`);
        this.connect();
      } else {
        logger.error(err);
        throw err;
      }
    });
  },
  backoff(time) {
    const milliseconds = time * 1000;
    const start = (new Date()).getTime();
    this.backoffTime *= 2;
    while (((new Date()).getTime() - start) < milliseconds) {
      // Elapse time
    }
    return (new Date()).getTime() - start;
  },
  async tweetFormatter(e) {
    const payload = {
      tweetID: e.id_str,
      createdAt: e.created_at,
      text: e.text,
      screenName: e.user.screen_name,
      userName: e.user.name,
      userScreenName: e.user.screen_name,
    };
    let place = null;
    if (e.place !== null) {
      place = { ...e.place };
    }
    if (e.geo !== null) {
      payload.geolocation = await locationOps.reverseGeolocation(e);
    }
    return { ...payload, place, twitterID: e.user.id_str };
  }
};

module.exports = twitter;
