// DEPENDENCIES
import { useDispatch } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// ACTIONS
import { selectVendorAsync, deSelectVendor } from '../../../redux/actions/data-actions';

// Selecting a vendor profile, called from dashboard link or from map point
const useSelectVendorProfile = () => {
    // Redux
    const dispatch = useDispatch();
    const state = useGetAppState();

    const regionId = state.data.regionId;

    return (vendorID: string, selectedVendorID?: string) => {
        // If a vendor profile is already selected, deselect it
        dispatch(deSelectVendor())

        dispatch(selectVendorAsync({ 
            regionId,
            vendorId: vendorID,
            cb: () => console.error('Invalid ID'),
        }))
    }
}

export default useSelectVendorProfile;
