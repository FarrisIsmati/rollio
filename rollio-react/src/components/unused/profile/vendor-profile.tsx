
/*

REBUILT FORM SCRATCH ONCE VENDOR/ADMIN DASHBOARD IS DESIGNED

*/













































// DEPENDENCIES
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import { useDispatch } from "react-redux";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../../config";
import { getRegion } from "../authentication/utils/get-region";

// HOOKS
import useGetAppState from "../../common/hooks/use-get-app-state";
import useGetRegions from '../authentication/hooks/use-get-regions';
import useAuthenticateRoute from "../../authentication/hooks/use-authenticate-route";

// REDUX
import { receiveUser } from "../../../redux/actions/user-actions";
import { receiveVendorData, fetchVendorDataAsync } from "../../../redux/actions/data-actions";

// INTERFACES
import { VendorFull } from "../../../redux/reducers/interfaces";

const UserProfile = (props:any) => {
    const dispatch = useDispatch();
    const { user, data, loadState } = useGetAppState();
    const { selectedVendor, regionsAll } = data;
    const { areRegionsLoaded } = loadState;
    const { type } = user;
    const [loading, setLoading] = useState<boolean>(true);
    const [localVendor, setLocalVendor] = useState<VendorFull>(selectedVendor);
    const [regionId, setRegionId] = useState<string>('');
    const { vendorId = '', regionName } = props.match.params;

    const updateLocalVendor = (key:string, value:string, isArray:boolean = false) => {
        let updatedValue;
        if (isArray) {
            // @ts-ignore
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

    useAuthenticateRoute(props, true);
    useGetRegions();

    // get the regionId from the regionName in the route
    useEffect(() => {
        if (!regionId && areRegionsLoaded) {
            const region = getRegion(regionsAll, 'name', regionName);
            setRegionId(region.id)
        }
    }, [regionId, areRegionsLoaded, regionName]);

    // get and set the vendor
    useEffect(() => {
        const needToLoadExistingVendor = vendorId && vendorId !== selectedVendor.id;
        const userAndRegionLoaded = user.isAuthenticated && regionId;
        if (userAndRegionLoaded && needToLoadExistingVendor) {
            dispatch(fetchVendorDataAsync({ regionId, vendorId, cb: reRouteCb }));
        } else if (user.isAuthenticated) {
            setLocalVendor({...selectedVendor, phoneNumber: ''});
            setLoading(false);
        }
    }, [user, selectedVendor, vendorId, regionId]);

    // fields to not include when sending to the backend
    const fieldsToExclude = ['id', 'hasAllRequiredFields', 'vendorID', 'twitterId', 'location'];

    // takes the form data and clears out the empty fields before sending to the backend for Vendor creation
    const dataForCreatingVendor = Object.keys(localVendor).reduce((acc:any, key:string) => {
        // @ts-ignore
        const value = localVendor[key];
        // exclude certain keys, as well as anything that was left blank
        if (!fieldsToExclude.includes(key) && value) {
            acc[key] = value;
        }
        return acc;
    }, {});

    // takes the form data and finds which fields were updated before sending to the backend for Vendor creation
    const dataForUpdatingVendor = Object.keys(localVendor).reduce((acc:any, key:string) => {
        // @ts-ignore
        const newValue = localVendor[key];
        const originalValue = selectedVendor[key];
        // exclude certain keys, as well as anything that hasn't changed
        if (!fieldsToExclude.includes(key) && newValue !== originalValue) {
            acc.field.push(key);
            acc.data.push(newValue);
        }
        return acc;
    }, {field: [], data: []});


    // TODO: fill in many more; or perhaps we want users to just be able to enter and autocomplete?
    const allCategories = ['Mexican', 'Italian'];
    const creditCardOptions = [{text: 'Yes', value: 'y'}, {text: 'No', value: 'n'}, {text: 'Unsure', value: 'u'}];

    // do not enable 'submit' unless all the required fields are filled in, and if the vendor already exists, info has been updated
    const requiredFields = ['name', 'type', 'description', 'creditCard', 'numTrucks'];
    const isANewVendor = !vendorId;
    const vendorDataHasBeenUpdated = dataForUpdatingVendor.field.length;
    // @ts-ignore
    const submitButtonEnabled = requiredFields.every(key => localVendor[key]) && (isANewVendor || vendorDataHasBeenUpdated);


    const handleSubmit = () => {
        setLoading(true);
        const axiosInfo = isANewVendor ?
            { method: "POST", data: dataForCreatingVendor, url: `${VENDOR_API}/vendor/${regionId}/new` } :
            { method: "PUT", data: dataForUpdatingVendor, url: `${VENDOR_API}/vendor/${regionId}/${vendorId}/update` };
        // @ts-ignore
        axios({
            ...axiosInfo,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                const vendorID = res.data.vendor._id;
                receiveVendorData(res.data.vendor);
                if (type === 'vendor') {
                    receiveUser({ ...user, vendorID });
                }
                props.history.push(`/region/${regionName}/vendor/${vendorID}`);
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
                    <select value={localVendor.type} onChange={e=>{updateLocalVendor('type', e.target.value)}}>
                        { ['mobileTruck', 'fixedTruck', 'cart', 'airstream', ''].map((type:string) => {
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
                    Number of trucks:
                    <input
                        type='number'
                        onChange={e=>{updateLocalVendor('numTrucks', e.target.value)}}
                        value={localVendor.numTrucks}
                        min={1}
                        max={5}
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
                {/* TODO: this selector is wonky - need to fix it*/}
                <label>
                    Pick your Categories:
                    <select value={localVendor.categories} multiple={true} onChange={e=>{updateLocalVendor('categories', e.target.value, true)}}>
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
                <input disabled={!submitButtonEnabled} type="submit" value="Submit" />
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
