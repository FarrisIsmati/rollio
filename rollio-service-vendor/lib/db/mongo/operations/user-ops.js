const mongoose = require('../mongoose/index');
const User = mongoose.model('User');
const Vendor = mongoose.model('Vendor');

module.exports = {
    async findUserById(userId) {
        return User.findById(userId);
    },
    async upsertTwitterUser(token, tokenSecret, profile, type) {
        let user = await User.findOne({ 'twitterProvider.id': profile.id });
        if (user) {
        // TODO: think about how to allow users to change 'type' if they want to.  For now, they are locked in after the first time
            return { user };
        }
        const { id, username, displayName, emails } = profile;
        const vendor = await Vendor.findOne({ twitterID: id });
        const vendorIdUpdate = vendor ? { vendorID: vendor._id } : {};
        const newUser = new User({
            email: emails[0].value,
            twitterProvider: {
                id,
                token,
                tokenSecret,
                username,
                displayName
            },
            ...vendorIdUpdate,
            type
        });
        user = await newUser.save();
        return { user };
    }
};
