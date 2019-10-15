interface LocationProp {
    location: {
        pathname: string
    }
}

// Get the general route id given the url /region/id/vendor/id
export const getRouteIds = (props:LocationProp) => {
    const route = props.location.pathname.substr(1).split('/');
    return {
        regionId: route[1],
        vendorId: route[3]
    }
}
