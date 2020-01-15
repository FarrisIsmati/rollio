import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import {fetchAllRegionsAsync} from "../../redux/actions/data-actions";

// TODO: BUILD THIS ALL OUT


const UserProfile = (props:any) => {
    const dispatch = useDispatch();
    const { user, data, loadState } = useGetAppState();
    const { areRegionsLoaded } = loadState;
    const { regionsAll } = data;
    const {
        isAuthenticated,
        id,
        type,
        vendorID,
        regionID,
        hasAllRequiredFields
    } = user;
    const [loading, setLoading] = useState<boolean>(true);
    // fields for customers to enter
    const [stateRegionID, setStateRegionID] = useState<string>(regionID || '');
    const [stateVendorID, setStateVendorID] = useState<string>(vendorID || '');
    // fields for vendors to enter
    const [stateName, setStateName] = useState<string>('');
    const stateTypeOptions = ['mobileTruck', 'fixedTruck', 'cart', 'airstream'];
    const [stateType, setStateType] = useState<string>(stateTypeOptions[0]);
    const [stateDescription, setStateDescription] = useState<string>('');
    const stateCreditCardOptions = [ { text: 'Yes', value: 'y' },
        { text: 'No', value: 'n' },
    ];
    const [stateCreditCard, setStateCreditCard] = useState<string>(stateCreditCardOptions[0].value);
    const [stateEmail, setStateEmail] = useState<string>('');
    const [stateWebsite, setStateWebsite] = useState<string>('');
    const [statePhoneNumber, setStatePhoneNumber] = useState<string>('');
    // const [stateMenu, setStateMenu] = useState<string>('');
    const [stateProfileImageLink, setStateProfileImageLink] = useState<string>('');
    const stateCategoryOptions = ['Mexican', 'Italian'];
    const [stateCategories, setStateCategories] = useState<any>([]);
    const vendorDisabled = !(stateName && stateType && stateDescription && stateCreditCard && stateEmail && stateWebsite && statePhoneNumber && stateProfileImageLink && stateCategories.length);


    useEffect(() => {
        if (!isAuthenticated && localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(() => setLoading(false)));
        } else if (!isAuthenticated) {
            props.history.push('/login')
        } else {
            setStateRegionID(regionID);
            setStateVendorID(vendorID);
            setLoading(false);
        }
        if (!areRegionsLoaded) {
            dispatch(fetchAllRegionsAsync());
        }
    }, [user, areRegionsLoaded]);

    const handleNewVendorSubmit = () => {
        //
    };

    let formContent;
    if (loading) {
        formContent = 'Loading...';
    } else if (type === 'vendor' || type === 'admin') {
        formContent = (
            <form onSubmit={handleNewVendorSubmit}>
                <label>
                    Name:
                    <input
                        type='text'
                        onChange={e=>{setStateName(e.target.value)}}
                        value={stateName}
                    />
                </label>
                <label>
                    Pick your Type:
                    <select value={stateType} onChange={e=>setStateType(e.target.value)}>
                        { stateTypeOptions.map((type:string) => {
                            return <option key={type} value={type}>{type}</option>
                        })}
                    </select>
                </label>
                <label>
                    Description:
                    <input
                        type='text'
                        onChange={e=>{setStateDescription(e.target.value)}}
                        value={stateDescription}
                    />
                </label>
                <label>
                    Accepts credit cards:
                    <select value={stateCreditCard} onChange={e=>setStateCreditCard(e.target.value)}>
                        { stateCreditCardOptions.map((creditCardOption:any) => {
                            const {value, text} = creditCardOption;
                            return <option key={value} value={value}>{text}</option>
                        })}
                    </select>
                </label>
                <label>
                    Email:
                    <input
                        type='text'
                        onChange={e=>{setStateEmail(e.target.value)}}
                        value={stateEmail}
                    />
                </label>
                <label>
                    Website:
                    <input
                        type='text'
                        onChange={e=>{setStateWebsite(e.target.value)}}
                        value={stateWebsite}
                    />
                </label>
                <label>
                    Profile Image Link:
                    <input
                        type='text'
                        onChange={e=>{setStateProfileImageLink(e.target.value)}}
                        value={stateProfileImageLink}
                    />
                </label>
                <label>
                    Phone Number:
                    <input
                        type='text'
                        onChange={e=>{setStatePhoneNumber(e.target.value)}}
                        value={statePhoneNumber}
                    />
                </label>
                <label>
                    Pick your Categories:
                    <select value={stateCategories} multiple={true} onChange={e=>setStateCategories(e.target.value)}>
                        { stateCategoryOptions.map((category:string) => {
                            return <option key={category} value={category}>{category}</option>
                        })}
                    </select>
                </label>
                <label>
                    Pick your region:
                    <select value={stateRegionID} onChange={e=>setStateRegionID(e.target.value)}>
                        { regionsAll.map((region:any) => {
                            const {id, name} = region;
                            return <option key={id} value={id}>{name}</option>
                        })}
                    </select>
                </label>
                <input disabled={vendorDisabled} type="submit" value="Submit" />
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
