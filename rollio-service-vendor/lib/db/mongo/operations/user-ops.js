const mongoose = require('../mongoose/index');
const User = mongoose.model('User');
const Vendor = mongoose.model('User');

module.exports = {
    async findUserById(userId) {
        return User.findById(userId);
    },
    upsertTwitterUser(token, tokenSecret, profile, cb) {
        try {
            return User.findOne({ 'twitterProvider.id': profile.id }).then(user => {
                if (user) {
                    return cb(null, user);
                }
                // no user was found, lets create a new one
                const { id, username, displayName, emails } = profile;
                // TODO: get this working
                Vendor.findOne({ twitterID: id }).then(vendor => {
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
                    newUser.save().then(newUser => cb(null, newUser));
                });
            });
        } catch (err) {
            cb(err, null);
        }
    }
};
