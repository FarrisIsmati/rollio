const { MongoClient } = require('mongodb');
const mongoDbLock = require('mongodb-lock');
const Migrator = require('./Migrator.js');
const migrationRegistry = require('./migrations');
const { MONGO_CONNECT } = require('../../../config');

const timeout = 2 * 60 * 1000; // 2 mins

const cleanup = async migrator => migrator.dispose().catch((err) => {
  console.error(err);
});

/**
 * Attempts to acquire a lock on the DB to run migrations
 * It will wait 2 mins (or whatever timeout is) before failing to acquire the lock and reject
 * the promise.
 *
 * Otherwise, it will resolve once it acquires a lock with a function
 * that can be called to release the lock.
 *
 * The lock is good for 2 mins before it's release.
 */
const acquireLock = (client, locksCollection) => {
  const db = client.db();
  const coll = db.collection(locksCollection);
  const lockName = 'application-migrations';

  // Lock object for migrations.
  const migrationLock = mongoDbLock(coll, lockName, {
    timeout,
    removeExpired: true,
  });

  return new Promise((resolve, rej) => {
    migrationLock.ensureIndexes((err) => {
      if (err) {
        console.log('Could not create lock indexes');
        console.log(err);
        rej(err);
      }
    });

    let pollingInterval;

    /**
     * We don't want this to be locked indefinitely. So, we'll try to acquire a lock
     * for a reasonable, set duration, and then fail if it's not found.
     */
    const rejectionTimeout = setTimeout(() => {
      pollingInterval && clearInterval(pollingInterval);
      rej(new Error('did not obtain lock soon enough'));
    }, timeout);

    const onLockAcquired = (releaseLock) => {
      // if the lock wasn't acquired on first attempt
      // we're in an interval and need to stop that
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }

      // stop the racing timeout that will reject on timeout
      clearTimeout(rejectionTimeout);

      // finally resolve the promise
      // for the `acquireLock` method
      resolve(releaseLock);
    };

    const attemptToAcquireLock = (cb) => {
      // we'll ignore the error here and just retry.
      migrationLock.acquire((error, lockId) =>
      // the lock id is our unique identifier
      // for the lock. It can be used in the
      // lock release call.
        (lockId ? cb(migrationLock.release.bind(migrationLock, lockId)) : cb()));
    };

    // Starts a polling interval to acquire a lock.
    const startPolling = () => {
      pollingInterval = setInterval(() => {
        attemptToAcquireLock(releaseLock => releaseLock && onLockAcquired(releaseLock));
      }, 10 * 1000);
    };

    // we try immediately to get a lock. It might not work
    // on the first go. And if it doesn't, then we start
    // polling every 10 secs for a lock.
    attemptToAcquireLock(releaseLock => (releaseLock ? onLockAcquired(releaseLock) : startPolling()));
  });
};


module.exports = async ({
  isTest = false,
  url = MONGO_CONNECT,
  migrations = migrationRegistry,
  locksCollection = '_locks',
} = {}) => {
  if (isTest) {
    return;
  }
  const client = new MongoClient(url || MONGO_CONNECT, {
    useNewUrlParser: true, // non-ideal way to upgrade APIs but *shrug*
    useUnifiedTopology: true,
    poolSize: 1,
  });
  const migrator = new Migrator({ client, migrations, timeout });

  const migrateAndReleaseLock = releaseLock => new Promise((resolve, reject) => {
    // Setting timeout to throw an error and hard reload app
    const assertCompletedMigrations = setTimeout(() => {
      reject(new Error('Migrations Not Completed within 2 minutes'));
    }, timeout);

    migrator.migrate((err, results) => {
      // need to cleanup migration timeout so it doesn't throw and kill process
      clearTimeout(assertCompletedMigrations);
      releaseLock(() =>
      // finish
        (err ? reject(err) : resolve(results)));
    });
  });

  /**
     * Run steps in sequence:
     * 1. connect DB client
     * 2. Acquire DB lock = permissions to run migrations
     * 3. Run migrations
     * 4. Cleanup DB connections, etc.
     * 5. Resolve with results of migration
     */
  return client
    .connect()
    .then(() => acquireLock(client, locksCollection))
    .then(migrateAndReleaseLock)
    .then(results => ({ results }))
    .catch(err => ({ err }))
    .then(async (res) => {
      const { results, err } = res;
      await cleanup(migrator);
      if (err) {
        throw err;
      } else {
        return results;
      }
    });
};
