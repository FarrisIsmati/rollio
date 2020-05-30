import useGetAppState from "../common/hooks/use-get-app-state";
import React from "react";
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";
import useAuthentication from "../common/hooks/use-authentication";
import useFetchUnapprovedVendors from "./hooks/useFetchUnapprovedVendors";

const UnapprovedVendorTable = (props:any) => {
    const { user } = useGetAppState();
    const goToLoginPage = () => {
        props.history.push('/login');
    };
    useAuthentication(props, true, true);
    const { vendors, vendorsLoaded, approveVendor } = useFetchUnapprovedVendors(props)
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
                    onClick={() => approveVendor(props.value)}
                >
                    Approve
                </button>
            )
        }
    ];
    const contentText = !(vendorsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
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
