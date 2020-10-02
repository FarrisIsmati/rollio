// DEPENDENCIES
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import useGetAppState from "../../common/hooks/use-get-app-state";
import {get} from "lodash";

// REDUX
import {fetchUserAsync} from "../../../redux/actions/user-actions";

const useAuthenticateRoute = (props:any, reRouteIfNotAuthenticated:boolean = false, reRouteIfNotAdminOrVendor:boolean = false, cb?:any) => {
    const { user } = useGetAppState();
    const dispatch = useDispatch();

    const vendorId = get(props, 'match.params.vendorId');
    const isVendorMatch = vendorId && user && user.vendorID === vendorId;

    useEffect(() => {
        if (localStorage.token && !user.isAuthenticated) {
            dispatch(fetchUserAsync(cb));
        } else if (reRouteIfNotAuthenticated && !localStorage.token) {
            props.history.push('/login');
        } else if (reRouteIfNotAdminOrVendor && user.isAuthenticated && (user.type !== 'admin' && !isVendorMatch )) {
            props.history.push('/permission-denied');
        }
    }, [user, vendorId]);
};

export default useAuthenticateRoute;
