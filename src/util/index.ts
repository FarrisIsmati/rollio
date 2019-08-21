interface LocationProp {
    location: {
        pathname: string
    }
}

export const getRouteIds = (props:LocationProp) => {
    const route = props.location.pathname.substr(1).split('/');
    return {
        regionId: route[1],
        vendorId: route[3]
    }
}
