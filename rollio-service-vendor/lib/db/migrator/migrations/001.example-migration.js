module.exports = {
  id: 'example-migration',
  async up() {
    const { db, logger } = this;
    const collections = await db
      .listCollections({
        name: 'vendors',
      })
      .toArray();
    if (collections.length !== 1) {
      return 'vendors collection is missing';
    }

    const vendorsCollection = db.collection('vendors');

    const bulkUpdates = [];
    // just an example - doesn't actually change anything
    bulkUpdates.push({
      updateOne: {
        filter: { numTrucks: 1 },
        update: {
          $set: {
            numTrucks: 1,
          },
        },
      },
    });
    if (bulkUpdates.length) {
      return vendorsCollection.bulkWrite(bulkUpdates);
    }
    return 'no vendors to update';
  },
};
