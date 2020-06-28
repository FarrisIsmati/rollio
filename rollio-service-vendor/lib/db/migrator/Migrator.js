const { get } = require('lodash');
const logger = require('../../../lib/log/index')('migrations');

class Migrator {
  constructor(client, migrations) {
    this._isDisposed = false;
    this._migrations = migrations;
    this._migrationsRun = {};
    this._result = {};
    this._client = client;
    this._connectionPromise = null;
    this._db = null; // defined after connected
    this._timeout = 60 * 1000; // 1 minute
    this._logger = logger;
  }

  /**
     * @public
     *
     * @param {function} done callback when finished, traditional node cb(err, res) style
     */
  migrate(done) {
    this._runWhenReady(done);
  }

  /**
     * Alias for Migrator.prototype.migrate
     *
     * @public
     */
  up() {
    this.migrate.apply(this, arguments);
  }

  /**
     * Clean up connections
     *
     * @public
     *
     * @param {function} cb node-style callback
     */
  // dispose(cb) {
  //   if (this._isDisposed) {
  //     return cb(new Error('already called migrator.dispose'));
  //   }
  //   this._isDisposed = true;
  //
  //   // the client is not connected—bail.
  //   if (!this._db) {
  //     return cb(null);
  //   }
  //
  //   // close the client connection.
  //   return this._client
  //     .close(true)
  //     .then(() => {
  //       delete this._db;
  //       cb(null);
  //     })
  //     .catch(cb);
  // }


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

  /**
     * Initiate the connection to the database
     *
     * @private
     *
     * @return {Promise->null} resovles once connected to the database
     */
  _connect() {
    if (!this._connectionPromise) {
      this._connectionPromise = this._client.isConnected() ? Promise.resolve() : this._client.connect();
      this._connectionPromise.then(() => {
        this._db = this._client.db();
      });
    }
    return this._connectionPromise;
  }

  /**
     * @private
     *
     * @return {mongodb.Collection} the mongodb collection object
     */
  _collection() {
    if (!this._db) {
      throw new Error('must call this._connect before calling this._collection');
    }
    return this._db.collection('_migrations');
  }

  _runWhenReady(cb) {
    // Guard to make sure this hasn't been disposed of yet.
    if (this._isDisposed) {
      return cb(new Error('This migrator is disposed and cannot be used any more'));
    }

    // wait for DB to be connected
    this._connect()
      .then(() => this._run(cb))
      .catch(cb);
  }

  _run(done) {
    // safeguard in case called while already in progress
    if (this._runInProgress) {
      return done(new Error('run in progress'));
    }
    this._runInProgress = true;

    // determine which migrations to run based on current state.
    this._result = {};
    const migrationsToRun = this._migrations.slice(0);
    this._logger.info(`Running ${migrationsToRun.length}`);

    /**
         * Setups some initial state
         */
    let i = 0;
    const totalMigrationsToRun = migrationsToRun.length;
    const migrationsCollection = this._collection();
    const migrationsCollectionUpdatePromises = [];

    /**
         * Call when a single migration finishes running.
         *
         * @param {string} id  the id of the migration that ran
         * @param {string} message optional message to save
         */
    const recordMigrationSuccess = (migration, message) => {
      this._migrationsRun[migration.id] = true;
      migrationsCollectionUpdatePromises.push(
        migrationsCollection.insertOne({
          id: migration.id,
          started: migration.started,
          finished: new Date(),
          message: message || '',
        }),
      );
    };

    /**
         * Called when _all_ migrations have run.
         *
         * @param {Error} [err] an error
         */
    const allDone = (err) => {
      // eslint-disable-next-line no-unused-expressions
      err
        ? this._logger.error(`migrations finished with ${err}`)
        : this._logger.info('migrations finished successfully');
      return Promise.all(migrationsCollectionUpdatePromises)
        .then(() => {
          this._runInProgress = false;
          return done(err, this._result);
        })
        .catch((error) => {
          this._runInProgress = false;
          done(error, this._result);
        });
    };

    /**
         * Recursive function that iterates through the available migrations
         * one at a time.
         */
    const runNext = () => {
      // Stop the recursion.
      if (i >= totalMigrationsToRun) {
        return allDone();
      }
      const migration = migrationsToRun[i];

      // increment recursion index.
      i += 1;

      /**
             * Handle a migration finishing. This can be called when the migration
             * runs succesffuly or is skipped.
             *
             * @param {object} res the response from the migration
             * @param {string} [res.message] an message to record in the DB on success
             */
      const migrationDone = (res) => {
        this._result[migration.id] = res;

        // TODO: logging based on statuses.
        switch (res.status) {
          case 'error':
            this._logger.error(`${migration.id} finished with error ${res.error || new Error('unknown failure')}`);
            break;
          case 'skip':
            this._logger.info(`${migration.id}: SKIP with reason ${res.reason || 'unknown'}`);
            break;
          case 'ok':
            this._logger.info(`${migration.id}: ok ${res.message ? `with message ${res.message}` : ''}`);
            break;
        }

        if (res.status === 'ok') {
          return recordMigrationSuccess(migration, get(res, 'message', ''));
        }
      };

      let isCallbackCalled = false;
      const timeoutId = setTimeout(() => {
        let err;
        isCallbackCalled = true;
        err = new Error('migration timed-out');
        migrationDone({
          status: 'error',
          reason: 'migration timed out',
          error: err,
        });
        return allDone(err);
      }, this._timeout);

      /**
             * Handle the migration run finishing.
             *
             * @param {Error}  [err]  the error from attempting to the run the migration
             * @param {string} [message] data from the migration run.
             */
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
          migrationDone({
            status: 'error',
            reason: 'encountered an error during migration',
            error: err,
          });

          // abort any following migrations instead of trying to run the next one.
          return allDone(err);
        }
        // success!
        migrationDone(data);

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
