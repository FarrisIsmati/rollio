const mongoose = require('../mongoose/index');

const Location = mongoose.model('Location');

module.exports = {
  async getAllLocations(query = {}) {
    return Location.find(query).sort([['startDate', -1]]);
  },
};
