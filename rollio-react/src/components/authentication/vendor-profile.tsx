import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {fetchUserAsync, receiveUser} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import {recieveVendorData, fetchVendorDataAsync} from "../../redux/actions/data-actions";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../config";

const UserProfile = (props:any) => {
    const dispatch = useDispatch();
    const { user, data } = useGetAppState();
    const { selectedVendor } = data;
    const { isAuthenticated, type } = user;
    const [loading, setLoading] = useState<boolean>(true);
    const [localVendor, setLocalVendor] = useState<any>(selectedVendor);
    const { vendorId = '', regionId } = props.match.params;

    const updateLocalVendor = (key:string, value:string, isArray:boolean = false) => {
        let updatedValue;
        if (isArray) {
            const currentValue = localVendor[key];
            const currentIdx = currentValue.indexOf(value);
            if (currentIdx > -1) {
                currentValue.splice(currentIdx,1);
                updatedValue = currentValue;
            } else {
                updatedValue = currentValue.concat(value);
            }
        } else {
            updatedValue = value;
        }
        setLocalVendor({...localVendor, [key]: updatedValue });
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
            setLocalVendor({...selectedVendor, type: 'mobileTruck', phoneNumber: ''});
            setLoading(false);
        }
    }, [user, selectedVendor, vendorId]);

    // TODO: fill in many more; or perhaps we want users to just be able to enter and autocomplete?
    const allCategories = ['Mexican', 'Italian'];
    const creditCardOptions = [{text: 'Yes', value: 'y'}, {text: 'No', value: 'n'}, {text: 'Unsure', value: 'u'}];
    const requiredFields = ['name', 'type', 'description', 'creditCard'];
    const disabled = !requiredFields.every(key => localVendor[key]);

    const getDataForSending = (vendorData:any) => {
        return Object.keys(vendorData).reduce((acc:any, key:string) => {
            const value = vendorData[key];
            // exclude certain keys, as well as anything that was left blank
            if (!['id', 'hasAllRequiredFields', 'vendorID', 'twitterId', 'location'].includes(key) && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
    };

    const handleSubmit = () => {
        setLoading(true);
        axios({
            method: "POST",
            data: getDataForSending(localVendor),
            url: `${VENDOR_API}/vendor/${regionId}/new`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                const vendorID = res.data.vendor._id;
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
                        type='number'
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
                    <select value={localVendor.categories} multiple={true} onChange={e=>{updateLocalVendor('categories', e.target.value, true)}}>
                        { allCategories.map((category:string) => {
                            return <option key={category} value={category} selected={localVendor.categories.includes[category]}>{category}</option>
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
