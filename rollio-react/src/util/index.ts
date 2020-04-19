import moment from "moment";
import {get} from "lodash";

interface LocationProp {
    location: {
        pathname: string
    }
}

// Get the general route id given the url /region/id/vendor/id
export const getRouteIds = (props:LocationProp) => {
    const route = props.location.pathname.substr(1).split('/');
    return {
        regionName: route[1],
        vendorId: route[3]
    }
}

export const isLocationActive = (location:any) => {
    return moment().isBefore(location.endDate) && moment().isAfter(location.startDate) && !location.overridden
};


export const isActive = (locations:any) => {
    return locations.some(isLocationActive)
};

export const getCurrentTruckLocation = (vendorID: string, truckNum: number, vendorsAll: any) => {
    const locations = get(vendorsAll, `${vendorID}.locations`, []);
    return locations.find((location:any) => truckNum === location.truckNum && isLocationActive(location))
}
