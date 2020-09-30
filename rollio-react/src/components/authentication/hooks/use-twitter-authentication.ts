// DEPENDENCIES
import {useDispatch} from "react-redux";
import constants from '../utils/constants';

// REDUX
import { receiveUser, fetchUserSuccess } from "../../../redux/actions/user-actions";
import { UserDefaultState } from "../../../redux/reducers/interfaces";

const useAuthentication = (history:any) => {
    const dispatch = useDispatch();

    return {
        // General failures
        twitterLoginFailure: (error:any) => {
            // Redirect away
            console.log(error);
            history.goBack();
        },
        // 401 Responses still get sent to twitterLoginSuccess
        // Failure handling happens here as well
        twitterLoginSuccess: (response:any) => {
            const token = response.headers.get('x-auth-token');
            response.json().then((user: UserDefaultState) => {
                if (user.status === constants.INACTIVE) {
                    // Redirect away to signup
                    // Show flash message
                    console.log('inactive go to signup')
                    history.push('/signup');
                } else if (user.status === constants.REQUESTED) {
                    // Redirect to notification page
                    // Show flash message
                    console.log('requested');
                    history.goBack();
                } else if (token) {
                    localStorage.token = token;
                    dispatch(receiveUser(user));
                    dispatch(fetchUserSuccess());
                    history.push('/profile/user');
                }
            });
        }
    }
};

export default useAuthentication;
