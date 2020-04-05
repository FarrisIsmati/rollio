import moment from "moment";

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
    return moment().isBefore(location.endDate) && moment().isAfter(location.startDate)
};

export const returnIsActiveFn = (locations:any) => {
    return () => locations.some(isLocationActive)
};
