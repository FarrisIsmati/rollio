const redis       = require('redis');
const bluebird    = require('bluebird');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on('error', err => {
  console.log("error :" + err);
})

client.on('ready', err => {
  console.log('ready');
})

//Creates a promise returning version of all redisClient functions
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = client;
