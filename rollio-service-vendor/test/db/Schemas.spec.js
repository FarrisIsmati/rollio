// DEPENDENCIES
const chai = require('chai');
const moment = require('moment');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;

// SCHEMAS
const Comment = mongoose.model('Comment');
const Region = mongoose.model('Region');
const Location = mongoose.model('Location');
const Vendor = mongoose.model('Vendor');
const User = mongoose.model('User');

// TESTS
describe('Schemas', () => {
  describe('Region schema', () => {
    it('expect to be invalid if timezone is not within schema timezone enum', (done) => {
      const fakeTimezone = 'FAKETEST';
      const region = new Region({ timezone: fakeTimezone });
      region.validate((err) => {
        expect(err.errors.timezone).to.exist;
        expect(err.errors.timezone.properties.message).to.equal(`\`${fakeTimezone}\` is not a valid enum value for path \`timezone\`.`);
        done();
      });
    });
  });

  describe('Location Schema', () => {
    it('expect to be invalid if there are more than three values in the coordinates field', (done) => {
      const coordinates = new Location({
        coordinates: { lat: 3.42424 },
      });
      coordinates.validate((err) => {
        expect(err.errors['coordinates.long']).to.exist;
        expect(err.errors['coordinates.long'].message).to.equal('Path `coordinates.long` is required.');
        done();
      });
    });

    it('expect to be invalid if the coordinates are out of the lat long ranges', (done) => {
      const coordinates = new Location({
        coordinates: { lat: 5000, long: 5000 },
      });
      coordinates.validate((err) => {
        expect(err.errors['coordinates.long']).to.exist;
        expect(err.errors['coordinates.long'].message).to.equal('Longitude is not in the correct range');
        expect(err.errors['coordinates.lat']).to.exist;
        expect(err.errors['coordinates.lat'].message).to.equal('Latitude is not in the correct range');
        done();
      });
    });

    it('expect default startDate, endDate, and locationDate to be set correctly', (done) => {
      const newLocation = new Location({ vendorID: mongoose.Types.ObjectId(), address: '123 street', coordinates: { lat: 5, long: 5 } });

      newLocation.save((err, location) => {
        if (err) {
          // Error won't show without this log
          // eslint-disable-next-line no-console
          console.log(err);
        }

        const { locationDate, startDate, endDate } = location;
        const endOfTomorrow = moment(new Date()).endOf('day').toDate();
        const currentDate = moment().format();
        expect(endDate).to.be.eql(endOfTomorrow);
        expect(moment(locationDate).format()).to.be.eql(currentDate);
        expect(moment(startDate).format()).to.be.eql(currentDate);
        done();
      });
    });
  });

  describe('Comment Schema', () => {
    it('expect to be invalid if the comment length is under 5 characters long', (done) => {
      const text = 'four';
      const comment = new Comment({ text });
      comment.validate((err) => {
        expect(err.errors).to.exist;
        expect(err.errors.text.properties.message).to.equal(`Path \`text\` (\`${text}\`) is shorter than the minimum allowed length (5).`);
        done();
      });
    });

    it('expect to be invalid if the comment length is over 255 characters long', (done) => {
      const text = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test t';
      const comment = new Comment({ text });
      comment.validate((err) => {
        expect(err.errors).to.exist;
        expect(err.errors.text.properties.message).to.equal(`Path \`text\` (\`${text}\`) is longer than the maximum allowed length (255).`);
        done();
      });
    });
  });

  describe('Vendor Schema', () => {
    it('expect to be invalid if type is not within schema timezone enum', (done) => {
      const fakeVendorType = 'mobileTrucks';
      const vendor = new Vendor({ type: fakeVendorType });

      vendor.validate((err) => {
        expect(err.errors.type).to.exist;
        expect(err.errors.type.properties.message).to.equal(`\`${fakeVendorType}\` is not a valid enum value for path \`type\`.`);
        done();
      });
    });

    it('expect to be invalid if creditCard is not within schema creditCard enum', (done) => {
      const creditCard = 'x';
      const vendor = new Vendor({ creditCard });
      vendor.validate((err) => {
        expect(err.errors.creditCard).to.exist;
        expect(err.errors.creditCard.properties.message).to.equal(`\`${creditCard}\` is not a valid enum value for path \`creditCard\`.`);
        done();
      });
    });
  });

  describe('User Schema', () => {
    it('expect hasAllRequiredFields to be true if type, email, and regionID included', (done) => {
      const newUser = new User({ type: 'admin', email: 'fake@fake.com', regionID: ObjectId() });

      newUser.save((err, user) => {
        expect(user.hasAllRequiredFields).to.be.true;
        done();
      });
    });

    it('expect hasAllRequiredFields to be false if regionID is not included', (done) => {
      const newUser = new User({ type: 'admin', email: 'fake@fake.com' });

      newUser.save((err, user) => {
        expect(user.hasAllRequiredFields).to.be.false;
        done();
      });
    });
  });
});
