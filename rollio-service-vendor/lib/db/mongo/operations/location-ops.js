const mongoose = require('../mongoose/index');

const Location = mongoose.model('Location');

module.exports = {
  async getAllLocations(query = {}) {
    const { vendorID } = query;
    const vendorIDQuery = vendorID ? { vendorID } : {};
    return Location.find({ ...vendorIDQuery }).sort([['startDate', -1]]);
  },
};
