// DEPENDENCIES
const PhoneNumber = require('awesome-phonenumber');
const config = require('../../../../config');

const phoneNumberValidate = (number) => {
  // If no phonenumber was entered
  if (number === '') {
    return true;
  }
  try {
    // Region Code currently only US
    const pn = new PhoneNumber(number, 'US');
    return pn.isValid();
  } catch (err) {
    // eslint-disable-next-line no-console
    if (config.NODE_ENV !== 'TEST_LOCAL' && config.NODE_ENV !== 'TEST_DOCKER') { console.log(err); }
    return false;
  }
};

module.exports = {
  phoneNumberValidate,
};
