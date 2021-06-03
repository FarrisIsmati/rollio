/* eslint-disable no-console */
// DEPENDENCIES
const Twitter = require('twitter');
const config = require('../../config');
const logger = require('../log/index')('twitter/index');

// LIB
const tweetParser = require('./parse/tweet-parser');
const geolocation = require('../bin/geolocation');
const sendParsedTweet = require('../messaging/send/send-parsed-tweet');

const twitter = {
  stream: null,
  vendorList: '',
  connectAtt: 0,
  backoffTime: 3,
  client: () => new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN,
    access_token_secret: config.TWITTER_ACCESS_SECRET,
  }),
  async streamClient(vendorList, tstIDs = '1053649707493404678') {
    if (config.NODE_ENV === 'TEST_LOCAL' || config.NODE_ENV === 'TEST_DOCKER') {
      twitter.vendorList = tstIDs;
    } else {
      twitter.vendorList = vendorList;
    }

    twitter.connect();

    return twitter.stream;
  },
  async connect(tstIDs = '1053649707493404678') {
    if (!twitter.vendorList.length) {
      twitter.vendorList = tstIDs;
    }

    twitter.stream = twitter.client().stream('statuses/filter', { follow: twitter.vendorList });

    twitter.connectAtt += 1;

    twitter.stream.on('connected', (e) => {
      logger.info(`Twitter: Connected ${e}`);
    });

    twitter.stream.on('data', async (e) => {
      // New process
      /* 
      If tweet has geolocation
        * Process tweet and send back to vendor service
      Else
        * Send raw tweet to NLP service via SQS
        * ANOTHER FUNCTION
          * Recieve NLP processed tweet via SQS
          * Format tweet
          * Send to vendor service
      */

      //// Old Process
      // const formattedTweet = await twitter.tweetFormatter(e);
      // const parsedTweet = await tweetParser.scanAddress(formattedTweet);
      // logger.info('Received Tweet');
      // logger.info(parsedTweet);
      // await sendParsedTweet({ ...parsedTweet, newLocations: [parsedTweet.location], location: undefined });
    });

    // Exponential backoff upon failure of stream up to 8 retries before shutting down
    twitter.stream.on('error', (err) => {
      twitter.stream.destroy();
      if (twitter.connectAtt < 8) {
        logger.error('Twitter: Connection failed trying again`');
        logger.error(err);
        twitter.backoff(twitter.backoffTime);
        logger.error(`attempts: ${twitter.connectAtt}`);
        twitter.connect();
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

    if (e.place) {
      place = { ...e.place };
    }

    if (e.geo) {
      payload.geolocation = await geolocation.reverseGeolocation(e);
    }

    return { ...payload, place, twitterID: e.user.id_str };
  }
};

module.exports = twitter;
