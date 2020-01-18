const mongoose = require('../mongoose/index');

const User = mongoose.model('User');
const Vendor = mongoose.model('Vendor');

module.exports = {
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
    return User.findOneAndUpdate({ _id }, { $set: data, ...unsetUpdate }, { new: true });
  },
  async upsertTwitterUser(token, tokenSecret, profile, type) {
    const {
      id, username, displayName, emails,
    } = profile;
    const existingUser = await User.findOne({ 'twitterProvider.id': id });
    if (existingUser) {
      // TODO: think about how to allow users to change 'type' if they want to.  For now, they are locked in after the first time
      return { user: existingUser };
    }
    const vendor = await Vendor.findOne({ twitterID: id });
    const vendorIdUpdate = vendor ? { vendorID: vendor._id } : {};
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
    // annoyingly, .save doesn't seem to honor the 'select: false' on the schema.  So, just deleting here
    delete user.twitterProvider;
    return { user };
  },
};
