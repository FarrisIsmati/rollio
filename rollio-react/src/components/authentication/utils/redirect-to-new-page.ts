
const redirectToNewPage = (props:any, user:any, regionsAll:any) => {
    const getRegionInfo = (regionID:string) => (regionID && regionsAll.find((region:any) => region.id.toString() === regionID)) || { name: 'WASHINGTONDC' };
    const { type = 'customer', regionID = '', vendorID = '', hasAllRequiredFields = false } = user || {};
    if (!hasAllRequiredFields) {
        props.history.push('/profile/user');
    } else if (type === 'customer') {
        const { name } = getRegionInfo(regionID);
        props.history.push(`/region/${name}`);
    } else if (type === 'admin') {
        props.history.push('/tweets');
    } else if (type === 'vendor' && vendorID) {
        // user is a vendor and the vendor is already created
        props.history.push(`/region/${regionID}/vendor/${vendorID}`);
    } else if (type === 'vendor') {
        // TODO: change to regionName
        // user is a vendor, but they haven't created the Vendor record, yet
        props.history.push(`/profile/region/${regionID}/vendor`);
    }
};

export default redirectToNewPage;
