import useGetAppState from "../common/hooks/use-get-app-state";
import React, {ChangeEvent, useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';

const TweetTable = (props:any) => {
    const dispatch = useDispatch();
    const now = moment(new Date());
    const remainder = 30 - (now.minute() % 30);
    const initialEndDate = moment(now).add(remainder, "minutes").toDate();
    const initialStartDate = moment(initialEndDate).subtract(1, 'days').toDate();
    const minDate = moment(initialEndDate).subtract(1000000, 'days').toDate();
    const [loading, setLoading] = useState<boolean>(true);
    const [rowsLoaded, setRowsLoaded] = useState<boolean>(false);
    const [vendor, setVendor] = useState<string>('all');
    const [startDate, setStartDate] = useState<Date>(initialStartDate);
    const [endDate, setEndDate] = useState<Date>(initialEndDate);

    const [rows, setRows] = useState([]);
    const {user} = useGetAppState();
    const tweetSearchUrl = `${VENDOR_API}/tweets/all`;

    const fetchTweets = () => {
        setLoading(true);
        const query = {startDate, endDate};
        axios({
            method: "GET",
            url: `${tweetSearchUrl}/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setRows(res.data.tweets);
                setRowsLoaded(true);
                setLoading(false);
            }).catch((err:any) => {
                setLoading(false);
                console.error(err);
                throw err;
            })
    };

    const columns = [
        {
            id: 'vendorID',
            Header: 'Vendor',
            accessor: (d:any) => d.vendorID.name
        },
        {
            id: 'date',
            Header: 'Date',
            accessor: (d:any) => moment(d.date).format('YYYY-MM-DD LT')
        },
        {
            Header: 'Text',
            accessor: 'text'
        }, {
            id: 'usedForLocation',
            Header: 'Used For Location',
            accessor: (d:any) => d.usedForLocation ? 'Yes' : 'No'
        }
    ];

    const  selectVendor = (e:ChangeEvent<HTMLSelectElement>) => {
        setVendor(e.target.value);
    };

    const  selectDate = (date:any, startOrEnd:string) => {
        if (startOrEnd === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date)
        }
        fetchTweets();
    };

    useEffect(() => {
        if (user.isAuthenticated) {
            fetchTweets();
        } else if(localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(fetchTweets));
        } else {
            setLoading(false);
        }
    }, []);
    const contentText = !(loading || rowsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = rowsLoaded ?
        (
            <div className="table_wrapper">
                {/* TODO: fill in real options for vendors */}
                <select value={vendor} onChange={e=>selectVendor(e)}>
                    <option value="all">All Vendors</option>
                    <option value="grapefruit">Grapefruit</option>
                    <option value="lime">Lime</option>
                    <option value="coconut">Coconut</option>
                    <option value="mango">Mango</option>
                </select>
                <DatePicker
                    selected={startDate}
                    onChange={e=>selectDate(e, 'start')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={minDate}
                    maxDate={initialEndDate}
                />
                <DatePicker
                    selected={endDate}
                    onChange={e=>selectDate(e, 'end')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={startDate}
                    maxDate={initialEndDate}
                />
                <div className="table_spacing">
                    <ReactTable
                        data={rows}
                        columns={columns}
                        defaultPageSize={10}
                    />
                </div>
            </div>
        ) :
        (
            <div>
                <p>{contentText}</p>
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(TweetTable);
