const moment = require('moment');
const { flatten } = require('lodash');

module.exports = (params) => {
  const {
    text, newLocations, link, vendor,
  } = params;
  const { name: vendorName, numTrucks } = vendor;
  const numLocations = newLocations.length;
  const addresses = flatten(newLocations.map((location) => {
    const {
      truckNum, startDate, endDate, address,
    } = location;
    return `
<mj-text><b>Truck # ${truckNum}: ${address}</b></mj-text>
<mj-text css-class="padding-bottom-10">Start: ${moment(startDate).format('LLLL')}, End: ${moment(endDate).format('LLLL')}</mj-text>
`;
  }));
  return `
  <mj-section>
    <mj-column>
      <mj-text css-class="h1 outside-box-position no-padding">${vendorName} sent a new tweet that resulted in ${numLocations} location(s):</mj-text>
    </mj-column>
  </mj-section>
  <mj-section css-class="box">
    <mj-column>
      <mj-text><i>Text: ${text}</i></mj-text>
     ${addresses}
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-column>
      <mj-text css-class="no-padding"><i>*Note: ${vendorName} has ${numTrucks} truck(s) registered</i></mj-text>
      <mj-button href="${link}">Edit Tweet</mj-button>
    </mj-column>
  </mj-section>
`;
};
