const mongoose = require('../mongoose/index');

const Location = mongoose.model('Location');

module.exports = {
  async getAllLocations(query = {}) {
    const { vendorID, ...rest } = query;
    // vendorID sometimes come back as just an empty string, which we should ignore
    const vendorIDQuery = vendorID ? { vendorID } : {};
    return Location.find({ ...rest, ...vendorIDQuery }).sort([['startDate', -1]]);
  },
};
