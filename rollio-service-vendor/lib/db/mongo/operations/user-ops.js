// DEPENDENCIES
const { omit } = require('lodash');
const mongoose = require('../mongoose/index');
const logger = require('../../../log/index')('db/mongo/operations/user-ops');

// SCHEMAs
const User = mongoose.model('User');
const Vendor = mongoose.model('Vendor');

const userOps = {
  async findUserById(userId, includeTwitterProvider = false) {
    return includeTwitterProvider ? User.findById(userId).select('+twitterProvider') : User.findById(userId);
  },
  async patchUser(_id, data) {
    let unsetUpdate = {};
    if (data.type && data.type !== 'vendor') {
      unsetUpdate = { $unset: { vendorID: 1 } };
      // eslint-disable-next-line no-param-reassign
      delete data.vendorID;
    }
    return User.findOneAndUpdate({ _id }, { $set: omit(data, ['twitterProvider']), ...unsetUpdate }, { new: true });
  },
  // Return existing user
  async getExistingTwitterUser(id) {
    try {
      // Check if user exists in DB return
      const existingUser = await User.findOne({ 'twitterProvider.id': id });

      if (existingUser) {
        return { user: existingUser };
      }

      return {};
    } catch (error) {
      logger.error(error);
      return {};
    }
  },
  // Create New User
  async upsertTwitterUser(token, tokenSecret, profile, type) {
    const {
      id, username, displayName, emails,
    } = profile;

    // If user already exists return existing user
    const existingUser = await userOps.getExistingTwitterUser(id);
    if (existingUser.user) {
      return existingUser
    }

    try {
      // Associate user with vendor if it exists
      const vendor = await Vendor.findOne({ twitterID: id });
      const vendorIdUpdate = vendor ? { vendorID: vendor._id } : {};

      // Create new user
      const newUser = await new User({
        email: emails[0].value,
        twitterProvider: {
          id,
          token,
          tokenSecret,
          username,
          displayName,
        },
        ...vendorIdUpdate,
        type,
      }).save();
  
      const user = newUser.toJSON();
      delete user.twitterProvider;
      return { user };
    } catch (error) {
      logger.error(error);
      return {};
    }
  }
};


module.exports = userOps;