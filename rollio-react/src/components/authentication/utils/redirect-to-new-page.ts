const { getRegion } = require('./get-region');

const redirectToNewPage = (props:any, user:any, regionsAll:any) => {
    const { type = 'customer', regionID = '', vendorID = '', hasAllRequiredFields = false } = user || {};
    if (!hasAllRequiredFields) {
        props.history.push('/profile/user');
    } else if (type === 'customer') {
        const { name } = getRegion(regionsAll, 'id', regionID);
        props.history.push(`/region/${name}`);
    } else if (type === 'admin') {
        props.history.push('/tweets');
    } else if (type === 'vendor' && vendorID) {
        const { name } = getRegion(regionsAll, 'id', regionID);
        // user is a vendor and the vendor is already created
        props.history.push(`/region/${name}/vendor/${vendorID}`);
    } else if (type === 'vendor') {
        const { name } = getRegion(regionsAll, 'id', regionID);
        // user is a vendor, but they haven't created the Vendor record, yet
        props.history.push(`/profile/region/${name}/vendor`);
    }
};

export default redirectToNewPage;
