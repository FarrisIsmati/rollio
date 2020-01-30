import {useEffect} from "react";
import {fetchUserAsync} from "../../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import useGetAppState from "./use-get-app-state";

const useAuthentication = (props:any, reRouteIfNotAuthenticated:boolean = false, reRouteIfNotAdmin:boolean = false, cb?:any) => {
    const { user } = useGetAppState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.token && !user.isAuthenticated) {
            dispatch(fetchUserAsync(cb));
        } else if (reRouteIfNotAuthenticated && !localStorage.token) {
            props.history.push('/login');
        } else if (reRouteIfNotAdmin && user.isAuthenticated && user.type !== 'admin') {
            props.history.push('/permission-denied');
        }
    }, [user]);
};

export default useAuthentication;
