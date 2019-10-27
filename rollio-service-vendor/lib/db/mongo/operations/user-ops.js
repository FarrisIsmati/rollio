const mongoose = require('../mongoose/index');
const User = mongoose.model('User');
const Vendor = mongoose.model('User');


module.exports = {
    async findUserById(userId) {
        return User.findById(userId)
    },
    upsertTwitterUser(token, tokenSecret, profile, cb) {
        return User.findOne({
            'twitterProvider.id': profile.id
        }, function(err, user) {
            // no user was found, lets create a new one
            if (!user) {
                const {id, username, displayName, emails} = profile;
                // Not 100% sure this is working correctly.  Will have to investigate further once I can properly seed my db
                Vendor.findOne({ twitterID: id }, function(err, vendor) {
                    const vendorIdUpdate = vendor ? {vendorID: vendor._id, type: 'vendor' } : {};
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
                    newUser.save(function(error, savedUser) {
                        if (error) {
                            console.log(error);
                        }
                        return cb(error, savedUser);
                    });
                });
            } else {
                return cb(err, user);
            }
        });
    }
};
