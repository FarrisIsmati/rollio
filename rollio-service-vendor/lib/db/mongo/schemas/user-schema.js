const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    type: { type: String, enum: ['user', 'admin', 'vendor'], required: true, default: 'user' },
    // could make this conditionally required if the user is of type 'vendor', but need to sort out the registration flow first
    vendorID: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Vendor' },
    facebookProvider: {
        type: {
            id: String,
            token: String,
            tokenSecret: String
        },
        select: false
    },
    twitterProvider: {
        type: {
            // NOTE: this 'id' should match the 'twitterId' field in the vendor-model
            id: String,
            token: String,
            username: String,
            displayName: String
        },
        // we can decide later if we want to keep the id as 'select' false
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

UserSchema.set('toJSON', {getters: true, virtuals: true});

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    const that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            const newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    const that = this;
    return this.findOne({
        'googleProvider.id': profile.id
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            const newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

module.exports = UserSchema;
