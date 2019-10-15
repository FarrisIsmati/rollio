// DEPENDENCIES
const chai = require('chai');
const mongoose = require('../../lib/db/mongo/mongoose/index');

const { expect } = chai;

// SCHEMAS
const Comment = mongoose.model('Comment');
const Region = mongoose.model('Region');
const Coordinates = mongoose.model('Coordinates');
const Vendor = mongoose.model('Vendor');

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

  describe('Coordinates Schema', () => {
    it('expect to be invalid if there are more than three values in the coordinates field', (done) => {
      const coordinates = new Coordinates({
        coordinates: [3.42424, -42.1414, 3.4114],
      });
      coordinates.validate((err) => {
        expect(err.errors.coordinates).to.exist;
        expect(err.errors.coordinates.message).to.equal('coordinates exceeds the limit of 2');
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
});
