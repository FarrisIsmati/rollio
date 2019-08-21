// DEPENDENCIES
import { useSelector, useDispatch  } from 'react-redux';

// ACTIONS
import { fetchVendorProfile } from '../../../redux/actions/data-actions';

const useVendorData = {    
    FetchVendorProfileData: (props: any) => {
        const { regionId, vendorId } = props;
        const dispatch = useDispatch();
        dispatch( fetchVendorProfile({ regionId, vendorId }) );
    },
    GetCommentsFromState: () => {
        return useSelector((state:any) => state.data.selectedVendor.comments)
    },
    GetVendorDataFromState: () => {
        return useSelector((state:any) => state.data.selectedVendor)
    }
}

export default useVendorData;
