import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import "react-datepicker/dist/react-datepicker.css";
import useAuthentication from "../common/hooks/use-authentication";

const UnapprovedVendorTable = (props:any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendors, setVendors] = useState<Location[]>([]);

    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const fetchVendors = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: `${VENDOR_API}/vendor/unapproved-vendors`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setVendors(res.data.vendors);
                setVendorsLoaded(true);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };

    const approve = (vendor:any) => {
        setLoading(true);
        const { regionID, _id: vendorID } = vendor;
        axios({
            method: "PUT",
            data: {
                regionID, vendorID, field: 'approved', data: true,
            },
            url: `${VENDOR_API}/vendor/${regionID}/${vendorID}/update`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then(() => {
                setVendors(vendors.filter((v:any) => v._id !== vendorID));
                setVendorsLoaded(true);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const columns = [
        {
            id: 'name',
            Header: 'Name',
            accessor: (d:any) => d.name
        },
        {
            id: 'numTrucks',
            Header: 'Number of Trucks',
            accessor: (d:any) => d.numTrucks
        },
        {
            id: 'displayName',
            Header: 'Twitter Display Name',
            accessor: (d:any) => d.twitterInfo.displayName || 'n/a'
        },
        {
            id: 'twitterHandle',
            Header: 'Twitter Handle',
            accessor: (d:any) => d.twitterInfo.username || 'n/a'
        },
        {
            id: 'actions',
            Header: 'Actions',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => (
                <button
                    id={props.id}
                    onClick={() => approve(props.value)}
                >
                    Approve
                </button>
            )
        }
    ];

    useAuthentication(props, true, true);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && !vendorsLoaded) {
            fetchVendors();
            // then get the locations, if they haven't been loaded yet or if startDate, endDate, or vendorID changes
        }
    }, [isAuthenticated, vendorsLoaded]);




    const contentText = !(loading || vendorsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = vendorsLoaded ?
        (
            <div className="table_wrapper">
                <div className="table_spacing">
                    <ReactTable
                        data={vendors}
                        columns={columns}
                        defaultPageSize={10}
                    />
                </div>
            </div>
        ) :
        (
            <div>
                <p>{contentText}</p>
                { !user.isAuthenticated &&
                    <button
                        onClick={() => goToLoginPage()}
                    >
                        Login
                    </button>
                }
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
};

export default withRouter(UnapprovedVendorTable);
