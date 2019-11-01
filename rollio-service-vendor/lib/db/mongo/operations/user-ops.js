const mongoose = require('../mongoose/index');
const User = mongoose.model('User');
const Vendor = mongoose.model('Vendor');

module.exports = {
    async findUserById(userId) {
        return User.findById(userId);
    },
    async upsertTwitterUser(token, tokenSecret, profile) {
        let user = await User.findOne({ 'twitterProvider.id': profile.id });
        if (user) {
            return { user };
        }
        const { id, username, displayName, emails } = profile;
        const vendor = await Vendor.findOne({ twitterID: id });
        const vendorIdUpdate = vendor ? { vendorID: vendor._id, type: 'vendor' } : {};
        const newUser = new User({
            email: emails[0].value,
            twitterProvider: {
                id,
                token,
                tokenSecret,
                username,
                displayName
            },
            ...vendorIdUpdate
        });
        user = await newUser.save();
        return { user };
    }
};
