// DEPENDENCIES
import { useDispatch } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// ACTIONS
import { selectVendorAsync, deselectAllVendors } from '../../../redux/actions/data-actions';
import { setshowSelectedVendor } from '../../../redux/actions/ui-actions';


// Selecting a vendor profile, called from dashboard link or from map point
const useSelectVendorProfile = () => {
    const state = useGetAppState();
    const dispatch = useDispatch();

    const regionId = state.data.regionId;

    return (vendorID: string) => {
        dispatch(deselectAllVendors({preventIfSameID: true, id: vendorID}))
        
        dispatch(selectVendorAsync({
            regionId,
            vendorId: vendorID,
            cb: () => console.error('Invalid ID'),
        }))

        dispatch(setshowSelectedVendor(true));
    }
}

export default useSelectVendorProfile;
