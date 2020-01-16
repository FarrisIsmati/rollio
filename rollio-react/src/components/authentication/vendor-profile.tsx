import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {fetchUserAsync, receiveUser} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import {recieveVendorData, fetchVendorDataAsync} from "../../redux/actions/data-actions";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../config";
import { omit } from 'lodash';

const UserProfile = (props:any) => {
    const dispatch = useDispatch();
    const { user, data } = useGetAppState();
    const { selectedVendor } = data;
    const { isAuthenticated, type } = user;
    const [loading, setLoading] = useState<boolean>(true);
    const [localVendor, setLocalVendor] = useState<any>(selectedVendor);
    const { vendorId = '', regionId } = props.match.params;

    const updateLocalVendor = (key:string, value:string) => {
        setLocalVendor({...localVendor, [key]: value});
    };

    const reRouteCb = () => {
        props.history.replace('/invalid');
    };

    useEffect(() => {
        if (!isAuthenticated && localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(() => setLoading(false)));
        } else if (!isAuthenticated) {
            props.history.push('/login')
        } else if (vendorId && vendorId !== selectedVendor.id) {
            fetchVendorDataAsync({ regionId, vendorId, cb: reRouteCb });
        } else {
            setLocalVendor(selectedVendor);
            setLoading(false);
        }
    }, [user, selectedVendor, vendorId]);

    // TODO: fill in many more; or perhaps we want users to just be able to enter and autocomplete?
    const allCategories = ['Mexican', 'Italian'];
    const creditCardOptions = [{text: 'Yes', value: 'y'}, {text: 'No', value: 'n'}, {text: 'Unsure', value: 'u'}];
    const requiredFields = ['name', 'type', 'description', 'creditCard'];
    const disabled = requiredFields.every(key => localVendor[key]);

    const handleSubmit = () => {
        setLoading(true);
        axios({
            method: "POST",
            data: omit(localVendor, ['id', 'hasAllRequiredFields', 'vendorID']),
            // TODO: build out this route
            url: `${VENDOR_API}/api/auth/users`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                const vendorID = res.data.vendor;
                recieveVendorData(res.data.vendor);
                if (type === 'vendor') {
                    receiveUser({ ...user, vendorID });
                }
                props.history.push(`/region/${regionId}/vendor/${vendorID}`);
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
    } else if (type === 'vendor' || type === 'admin') {
        formContent = (
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('name', e.target.value)}}
                        value={localVendor.name}
                    />
                </label>
                <label>
                    Type:
                    <select value={localVendor.type} onChange={e=>{updateLocalVendor('categories', e.target.value)}}>
                        { ['mobileTruck', 'fixedTruck', 'cart', 'airstream'].map((type:string) => {
                            return <option key={type} value={type}>{type}</option>
                        })}
                    </select>
                </label>
                <label>
                    Description:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('description', e.target.value)}}
                        value={localVendor.description}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('email', e.target.value)}}
                        value={localVendor.email}
                    />
                </label>
                <label>
                    Website:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('website', e.target.value)}}
                        value={localVendor.website}
                    />
                </label>
                <label>
                    Phone Number:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('phoneNumber', e.target.value)}}
                        value={localVendor.phoneNumber}
                    />
                </label>
                <label>
                    Profile Image Link:
                    <input
                        type='text'
                        onChange={e=>{updateLocalVendor('profileImageLink', e.target.value)}}
                        value={localVendor.profileImageLink}
                    />
                </label>
                <label>
                    Pick your Categories:
                    <select value={localVendor.categories} multiple={true} onChange={e=>{updateLocalVendor('categories', e.target.value)}}>
                        { allCategories.map((category:string) => {
                            return <option key={category} value={category}>{category}</option>
                        })}
                    </select>
                </label>
                <label>
                    Accepts credit cards:
                    <select value={localVendor.creditCard} onChange={e=>{updateLocalVendor('creditCard', e.target.value)}}>
                        { creditCardOptions.map((creditCardOption:any) => {
                            const {value, text} = creditCardOption;
                            return <option key={value} value={value}>{text}</option>
                        })}
                    </select>
                </label>
                <input disabled={disabled} type="submit" value="Submit" />
            </form>
        )
    } else {
        formContent = 'Only vendors or admins can edit vendor content';
    }

    return (
        <div className="profileform__wrapper">
            {formContent}
        </div>
    )
};

export default withRouter(UserProfile);
