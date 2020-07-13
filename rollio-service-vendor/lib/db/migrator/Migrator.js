const { get, cloneDeep } = require('lodash');
const logger = require('../../../lib/log/index')('migrations');

class Migrator {
  constructor({ client, migrations, timeout }) {
    this._isDisposed = false;
    this._migrations = migrations;
    this._migrationsRun = {};
    this._result = {};
    this._client = client;
    this._connectionPromise = null;
    this._migrationsCollectionUpdatePromises = [];
    this._db = null; // defined after connected
    this._result = {};
    this._timeout = timeout || 60 * 1000; // 1 minute
    this._logger = logger;
  }

  allDone(done, err) {
    // eslint-disable-next-line no-unused-expressions
    err
      ? this._logger.error(`migrations finished with ${err}`)
      : this._logger.info('migrations finished successfully');
    return Promise.all(this._migrationsCollectionUpdatePromises)
      .then(() => {
        this._runInProgress = false;
        return done(err, this._result);
      })
      .catch((error) => {
        this._runInProgress = false;
        done(error, this._result);
      });
  }

  // cleanup
  dispose() {
    if (this._isDisposed) {
      throw new Error('already called migrator.dispose');
    }
    this._isDisposed = true;

    // the client is not connected—bail.
    if (!this._db) {
      return null;
    }

    // close the client connection.
    return this._client
      .close(true)
      .then(() => {
        delete this._db;
        return null;
      })
      .catch((err) => {
        throw err;
      });
  }

  _connect() {
    if (!this._connectionPromise) {
      this._connectionPromise = this._client.isConnected() ? Promise.resolve() : this._client.connect();
      this._connectionPromise.then(() => {
        this._db = this._client.db();
      });
    }
    return this._connectionPromise;
  }

  _collection() {
    if (!this._db) {
      throw new Error('must call this._connect before calling this._collection');
    }
    return this._db.collection('_migrations');
  }

  migrate(cb) {
    // Guard to make sure this hasn't been disposed of yet.
    if (this._isDisposed) {
      return cb(new Error('This migrator is disposed and cannot be used any more'));
    }

    // wait for DB to be connected
    this._connect()
      .then(() => this._run(cb))
      .catch(cb);
  }

  recordMigrationSuccess(migration, message) {
    this._migrationsRun[migration.id] = true;
    this._migrationsCollectionUpdatePromises.push(
      this._collection().insertOne({
        id: migration.id,
        started: migration.started,
        finished: new Date(),
        message: message || '',
      }),
    );
  }

  migrationDone(res, migration) {
    this._result[migration.id] = res;
    const { status } = res;
    if (status === 'ok') {
      this._logger.info(`${migration.id}: ok ${res.message ? `with message ${res.message}` : ''}`);
      return this.recordMigrationSuccess(migration, get(res, 'message', ''));
    }
    if (status === 'skip') {
      this._logger.info(`${migration.id}: SKIP with reason ${res.reason || 'unknown'}`);
    } else {
      this._logger.error(`${migration.id} finished with error ${res.error || new Error('unknown failure')}`);
    }
  }


  _run(done) {
    // safeguard in case called while already in progress
    if (this._runInProgress) {
      return done(new Error('run in progress'));
    }
    this._runInProgress = true;

    // determine which migrations to run based on current state.
    const migrationsToRun = cloneDeep(this._migrations);
    this._logger.info(`Running ${migrationsToRun.length}`);

    let i = 0;
    const totalMigrationsToRun = migrationsToRun.length;

    const runNext = () => {
      // Stop the recursion.
      if (i >= totalMigrationsToRun) {
        return this.allDone(done);
      }
      const migration = migrationsToRun[i];

      // increment recursion index.
      i += 1;

      let isCallbackCalled = false;
      const timeoutId = setTimeout(() => {
        isCallbackCalled = true;
        const err = new Error('migration timed-out');
        this.migrationDone({
          status: 'error',
          reason: 'migration timed out',
          error: err,
        }, migration);
        return this.allDone(done, err);
      }, this._timeout);

      const handleMigrationFinished = (err, data) => {
        // if isCallbackCalled is truthy, then the migration
        // finished after the migration timed out. Skip any
        // more processing.
        if (isCallbackCalled) {
          return;
        }

        // finshed in advance of the timeout. reset that so it doesn't cause the rest of the run to fail.
        isCallbackCalled = true;
        clearTimeout(timeoutId);

        // the migration encountered an error.
        if (err) {
          this.migrationDone({
            status: 'error',
            reason: 'encountered an error during migration',
            error: err,
          }, migration);

          // abort any following migrations instead of trying to run the next one.
          return this.allDone(done, err);
        }
        // success!
        this.migrationDone(data, migration);

        // recurse to next one.
        return runNext();
      };

      // record the start time.
      migration.started = new Date();

      // lookup to see if the migration has already been run or not.
      this._collection().findOne({ id: migration.id }, { limit: 1 }, (err, existingMigration) => {
        // there was an error finding for the migration
        if (err) {
          return handleMigrationFinished(err);
        }

        const doTheActualMigration = () => {
          // the migration _wasn't found already. We need to run it.
          // allow the migration to return a promise or use callback.
          try {
            const boundMigrationFunction = migration.up.bind({
              db: this._client.db(),
              logger: this._logger,
            });

            boundMigrationFunction()
              .then(message => handleMigrationFinished(null, {
                status: 'ok',
                reason: 'success',
                message: typeof message === 'string' ? message : '',
              }));
          } catch (error) {
            handleMigrationFinished(error);
          }
        };

        // we have already run the migration.
        if (existingMigration) {
          // the migration exists to revert.
          handleMigrationFinished(null, {
            status: 'skip',
            reason: 'migration already run',
            code: 'already_run',
          });
        } else {
          // the migration doesn't exist... so there's nothing to migrate down.
          doTheActualMigration();
        }
      });
    };

    // call the recursive function to get this party started.
    return runNext();
  }
}

module.exports = Migrator;
