// DEPENDENCIES
import { useSelector, useDispatch  } from 'react-redux';
import axios, { AxiosResponse } from 'axios'

// ENV
import { VENDOR_API } from '../../../config';

// ACTIONS
import { recieveVendorProfile } from '../../../redux/actions/data-actions';

const useVendorData = {    
    // Gets vendor profile data, if it fails redirects to an error page
    FetchVendorProfileData: (props: any) => {
        const { regionId, vendorId, history } = props;

        const dispatch = useDispatch();

        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
        .then((res: AxiosResponse<any>) => {
            dispatch(recieveVendorProfile(res.data));
        })
        .catch((err) => {
            console.error(err);
            history.replace('/invalid');
        })
    },
    GetCommentsFromState: () => {
        return useSelector((state:any) => state.data.selectedVendor.comments)
    },
    GetVendorDataFromState: () => {
        return useSelector((state:any) => state.data.selectedVendor)
    }
}

export default useVendorData;
