const { MongoClient } = require('mongodb');
const mongoDbLock = require('mongodb-lock');
const Migrator = require('./Migrator.js');
const migrationRegistry = require('./list-of-migrations');
const { MONGO_CONNECT } = require('../../../config');

const timeoutDuration = 2 * 60 * 1000; // 2 mins


module.exports = async ({ url = MONGO_CONNECT, locksCollection, migrations = migrationRegistry } = {}) => {
  const client = new MongoClient(url || MONGO_CONNECT, {
    useNewUrlParser: true, // non-ideal way to upgrade APIs but *shrug*
    useUnifiedTopology: true,
    poolSize: 1,
  });
  const migrator = new Migrator(client, migrations);

  let cleanedUp = false;

  /**
     * Need to do a couple bits of cleanup,
     * especially around connections to the
     * mongo client.
     *
     * migrator keeps connections
     * the client for obtaining locks has connections
     */
  const cleanup = async function () {
    // safeguard
    if (cleanedUp) {
      return;
    }

    await migrator.dispose().catch((err) => {
      console.error(err);
    });

    cleanedUp = true;
    // return Promise.all([
    //   new Promise(res => migrator.dispose(() => {
    //     res(); // ignoring shutdown error and just resolving
    //   })),
    //   client.close(),
    // ]).then(() => {
    //   cleanedUp = true;
    // });
  };

  /**
     * Attempts to acquire a lock on the DB to run migrations
     * It will wait 2 mins before failing to acquire the lock and reject
     * the promise.
     *
     * Otherwise, it will resolve once it acquires a lock with a function
     * that can be called to release the lock.
     *
     * The lock is good for 2 mins before it's release.
     *mongodb-lock
     * @return {Promise->function} a promise that resolves with a function to release the lock
     */
  const acquireLock = function () {
    const db = client.db();
    const coll = db.collection(locksCollection || '_locks');
    const lockName = 'application-migrations';

    // Lock object for migrations.
    // look into https://docs.mongodb.com/manual/reference/method/db.fsyncLock/ instead
    const migrationLock = mongoDbLock(coll, lockName, {
      timeout: timeoutDuration,
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

      let pollingInterval; let
        rejectionTimeout;

      /**
             * We don't want this to be locked indefinitely. So, we'll try to acquire a lock
             * for a reasonable, set duration, and then fail if it's not found.
             */
      rejectionTimeout = setTimeout(() => {
        pollingInterval && clearInterval(pollingInterval);
        rej(new Error('did not obtain lock soon enough'));
      }, timeoutDuration);

      /**
             * Called once the lock is acquired
             *
             * @param {function} releaseLock a callback to call to release migration lock
             */
      const onLockAcquired = (releaseLock) => {
        // if the lock wasn't acquired on first attempt
        // we're in an interval and need to stop that
        pollingInterval && clearInterval(pollingInterval);

        // stop the racing timeout that will reject on timeout
        clearTimeout(rejectionTimeout);

        // finally resolve the promise
        // for the `acquireLock` method
        resolve(releaseLock);
      };

      /**
             * Attempt to get a lock.
             *
             * @param {function} done called once the acquisition has been attempting
             */
      const attemptToAcquireLock = (done) => {
        // we'll ignore the error here and just retry.
        migrationLock.acquire((error, lockId) =>
          // the lock id is our unique identifier
          // for the lock. It can be used in the
          // lock release call.
          (lockId ? done(migrationLock.release.bind(migrationLock, lockId)) : done()));
      };

      /**
             * Starts a polling interval to acquire a lock.
             */
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
    .then(() => acquireLock())
    .then(releaseLock => new Promise((resolve, reject) => {
      // Setting timeout to throw an error and hard reload app
      const assertCompletedMigrations = setTimeout(() => {
        reject(new Error('Migrations Not Completed within 2 minutes'));
      }, timeoutDuration);

      migrator.migrate((err, results) => {
        // need to cleanup migration timeout so it doesn't throw and kill process
        clearTimeout(assertCompletedMigrations);
        releaseLock(() =>
          // finish
          (err ? reject(err) : resolve(results)));
      });
    }))
    .then(async (results) => {
      await cleanup();
      return results;
    })
    .catch((err) => {
      // Something threw along the way. Just
      // make sure that things are cleaned up.
      cleanup();

      // rethrow original error
      throw err;
    });
};
