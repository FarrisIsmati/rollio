const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    type: { type: String, enum: ['customer', 'admin', 'vendor'], required: true, default: 'customer' },
    // could make this conditionally required if the user is of type 'vendor', but need to sort out the registration flow first
    vendorID: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Vendor' },
    regionID: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Region' },
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

// we can update the list of required fields as we go.  If all these fields aren't filled in, then the user will be asked to fill them in on login
UserSchema.virtual('hasAllRequiredFields').get(function() {
    const requiredFields = ['email', 'type'];
    // vendorID is needed if the user is a vendor; regionID is needed if the user is a 'customer' (or 'admin')
    return requiredFields.every(field => this[field]) && this.type === 'vendor' ? this.vendorID : this.regionID;
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
