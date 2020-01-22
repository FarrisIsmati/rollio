import {useEffect} from "react";
import {fetchUserAsync} from "../../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import useGetAppState from "./use-get-app-state";

const useAuthentication = (props:any, reRouteIfNotAuthenticated:boolean = false, cb?:any) => {
    const { user } = useGetAppState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.token && !user.isAuthenticated) {
            dispatch(fetchUserAsync(cb));
        } else if (!localStorage.token && reRouteIfNotAuthenticated) {
            props.history.push('/login');
        }
    }, [user]);
};

export default useAuthentication;
