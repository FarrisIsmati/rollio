// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';
import axios, { AxiosResponse } from 'axios';

// ENV
import { VENDOR_API } from '../../../config';

// ACTIONS
import { recieveVendorProfile } from '../../../redux/actions/data-actions';

const useGetVendorData = (props:any) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const { regionId, vendorId, history } = props;

        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
        .then((res: AxiosResponse<any>) => {
            dispatch(recieveVendorProfile(res.data));
        })
        .catch((err) => {
            console.error(err);
            history.replace('/invalid');
        })
    }, [])
}

export default useGetVendorData;
