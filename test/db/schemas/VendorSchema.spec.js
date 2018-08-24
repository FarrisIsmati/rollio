//DEPENDENCIES
const mongoose    = require('../../../controllers/db/schemas/AllSchemas');
const chai        = require('chai');
const expect      = chai.expect;

//SCHEMAS
const Coordinates        = mongoose.model('Coordinates');
const Vendor             = mongoose.model('Vendor');

//TESTS
describe('Coordinates Schema', function() {
  it('should be invalid if there are more than three values in the coordinates field', done => {
      const coordinates = new Coordinates({
        coordinates: [3.42424, -42.1414, 3.4114]
      });
      coordinates.validate(err => {
        expect(err.errors.coordinates).to.exist;
        expect(err.errors.coordinates.message).to.equal('coordinates exceeds the limit of 2');
        done();
      });
  });
});

describe('Vendor Schema', function() {
  it('should be invalid if type is not within schema timezone enum', done => {
      const fakeVendorType = 'mobileTrucks'
      const vendor = new Vendor({ type: fakeVendorType});

      vendor.validate(err => {
          expect(err.errors.type).to.exist;
          expect(err.errors.type.properties.message).to.equal(`\`${fakeVendorType}\` is not a valid enum value for path \`type\`.`)
          done();
      });
  });
});
