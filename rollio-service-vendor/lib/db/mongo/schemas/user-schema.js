const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String, required: false, trim: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  type: {
    type: String, enum: ['customer', 'admin', 'vendor'], required: true, default: 'customer',
  },
  vendorID: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Vendor' },
  regionID: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Region' },
  twitterProvider: {
    type: {
      // if the user is a 'vendor', then it should match the vendor's twitterID
      id: String,
      token: String,
      username: String,
      displayName: String,
    },
    // we can decide later if we want to keep the id as 'select' false
    select: false,
  }
});

// we can update the list of required fields as we go.
// If all these fields aren't filled in, then the user will be asked to fill them in on login
UserSchema.virtual('hasAllRequiredFields').get(function () {
  const requiredForEverybody = ['email', 'type', 'regionID'];
  // in case in the future if some fields are only required for customers and some only for vendors
  const requiredForCustomersOnly = [];
  const requiredForVendorsOnly = [];
  const requiredFields = [...requiredForEverybody, ...(this.type === 'vendor' ? requiredForVendorsOnly : requiredForCustomersOnly)];
  return requiredFields.every(field => this[field]);
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = UserSchema;
