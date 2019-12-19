// DEPENDENCIES
const PhoneNumber = require('awesome-phonenumber');

const phoneNumberValidate = (number) => {
  // If no phonenumber was entered
  if (number === '') {
    return true;
  }
  try {
    console.log(PhoneNumber)
    // Region Code currently only US
    const pn = new PhoneNumber(number, '1');
    return pn.isValid();
  } catch (err) {
    console.error(err)
    return false
  }

};

module.exports = {
  phoneNumberValidate,
};
