// DEPENDENCIES
const PhoneNumber = require('awesome-phonenumber');
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
    console.error(err);
    return false
  }

};

module.exports = {
  phoneNumberValidate,
};
