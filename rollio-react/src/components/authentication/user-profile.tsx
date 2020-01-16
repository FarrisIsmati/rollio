import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {fetchUserAsync, receiveUser} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import {fetchAllRegionsAsync} from "../../redux/actions/data-actions";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../config";
import { omit } from 'lodash';


const UserProfile = (props:any) => {

    const dispatch = useDispatch();
    const { user, data, loadState } = useGetAppState();
    const { areRegionsLoaded } = loadState;
    const { regionsAll } = data;
    const {
        isAuthenticated
    } = user;
    const [loading, setLoading] = useState<boolean>(true);
    const [localUser, setLocalUser] = useState<any>(user);

    const updateLocalUser = (key:string, value:string) => {
        setLocalUser({...localUser, [key]: value});
    };

    const requiredForEverybody = ['email', 'type'];
    const requiredForCustomersOnly = ['regionID'];
    const requiredForVendorsOnly: never[] = [];
    const requiredFields = [...requiredForEverybody, ...(localUser.type === 'vendor' ? requiredForVendorsOnly : requiredForCustomersOnly)];
    const disabled = !requiredFields.every(field => localUser[field]);


    useEffect(() => {
        if (!isAuthenticated && localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(() => setLoading(false)));
        } else if (!isAuthenticated) {
            props.history.push('/login')
        } else {
            setLocalUser(user);
            setLoading(false);
        }
        if (!areRegionsLoaded) {
            dispatch(fetchAllRegionsAsync());
        }
    }, [user, areRegionsLoaded]);

    const getRegionInfo = (regionID:string) => regionsAll.find((region:any) => region.id.toString() === regionID) || { name: 'WASHINGTONDC' };

    const redirectToNewPage = (updatedUser:any) => {
        const { type = 'customer', regionID = '', vendorID = '', hasAllRequiredFields = false } = updatedUser || {};
        if (!hasAllRequiredFields) {
            props.history.push('/profile/user');
        } else if (type === 'customer') {
            const { name } = getRegionInfo(regionID);
            props.history.push(`/region/${name}`);
        } else if (type === 'admin') {
            props.history.push('/tweets');
        } else if (type === 'vendor' && vendorID) {
            props.history.push(`/region/${regionID}/vendor/${vendorID}`);
        } else if (type === 'vendor') {
            props.history.push(`/profile/${regionID}/vendor`);
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        axios({
            method: "POST",
            data: omit(localUser, ['id', 'hasAllRequiredFields', 'vendorID']),
            url: `${VENDOR_API}/api/auth/users`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                receiveUser(res.data.user);
                redirectToNewPage(res.data.user);
                setLoading(false);
            })
            .catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    let formContent;
    if (loading) {
        formContent = 'Loading...';
    } else {
        formContent = (
            <form onSubmit={handleSubmit}>
                <label>
                    Pick your Account Type:
                    <select value={localUser.type} onChange={e=>updateLocalUser('type', e.target.value)}>
                        <option value='customer'>Customer</option>
                        <option value='vendor'>Vendor</option>
                    </select>
                </label>
                <label>
                    Email Address:
                    <input
                        type='text'
                        onChange={e=>updateLocalUser('email', e.target.value)}
                        value={localUser.email}
                    />
                </label>
                <label>
                    Pick your region:
                    <select value={localUser.regionID} onChange={e=>updateLocalUser('regionID', e.target.value)}>
                        { regionsAll.map((region:any) => {
                            const {id, name} = region;
                            return <option key={id} value={id}>{name}</option>
                        })}
                    </select>
                </label>
                <button disabled={disabled} type="submit">Submit</button>
            </form>
        )
    }

    return (
        <div className="profileform__wrapper">
            {formContent}
        </div>
    )
};

export default withRouter(UserProfile);
