import useGetAppState from "../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import { useDispatch } from "react-redux";
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";

const UpdateLocation = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useGetAppState();
    const tweetUrl = `${VENDOR_API}/tweets`;

    useEffect(() => {

    }, []);

    const content =
        (
            <div>
                <p>TO FILL IN LATER</p>
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(UpdateLocation);
