import useGetAppState from "../../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import { receiveUser } from "../../../redux/actions/user-actions";
import useGetRegions from '../authentication/hooks/use-get-regions';
import useAuthentication from "../../common/hooks/use-authentication";
import redirectToNewPage from "../authentication/utils/redirect-to-new-page";
import { UserDefaultState } from "../../../redux/reducers/interfaces";
import axios, {AxiosResponse} from "axios";
import { VENDOR_API } from "../../../config";
import { omit } from 'lodash';
import { RegionNameOnly } from "../authentication/interfaces";

const UserProfile = (props:any) => {
    const { user, data, loadState } = useGetAppState();
    const { regionsAll } = data;
    const { areRegionsLoaded } = loadState;
    const [loading, setLoading] = useState<boolean>(true);
    const [localUser, setLocalUser] = useState<UserDefaultState>(user);

    const updateLocalUser = (key:string, value:string) => {
        setLocalUser({...localUser, [key]: value});
    };

    // disable the submit button unless all the required fields have been filled in
    const requiredFields = ['email', 'type', 'regionID'];
    // @ts-ignore
    const disabled = !requiredFields.every(field => localUser[field]);

    useAuthentication(props, true);
    useGetRegions();
    useEffect(() => {
        if (user.isAuthenticated && areRegionsLoaded){
            // set a default regionID for the dropdown selector if there isn't any
            const regionID = user.regionID || regionsAll[0].id;
            setLocalUser({ ...user, regionID });
            setLoading(false);
        }
    }, [user, areRegionsLoaded]);

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
                redirectToNewPage(props, res.data.user, regionsAll);
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
                        { regionsAll.map((region:RegionNameOnly) => {
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
