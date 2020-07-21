// DEPENDENCIES
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import { toggleMobileDashboard, setshowSelectedVendor } from '../../../redux/actions/ui-actions';


const useGetInfoCardData = () => {
    // Effects
    const state = useGetAppState();
    const dispatch = useDispatch();

    const vendor = state.data.selectedVendor;

    const onClick = () => { 
        dispatch(setshowSelectedVendor(true));
        dispatch(toggleMobileDashboard())
    };

    return {
        profileImageLink: vendor.profileImageLink,
        name: vendor.name,
        onClick
    }
}

export default useGetInfoCardData;
