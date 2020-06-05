// DEPENDENCIES
import React, { ReactComponentElement } from 'react';
import Dotdotdot from 'react-dotdotdot'
import moment from 'moment';

const Tweet = (props:any) => {
    const {
        twitterUserName,
        twitterHandle,
        twitterProfileImage,
    } = props;
    const {
        date,
        tweetID,
        text,
    } = props.tweetData;

    // Momentify Date and conver to MM DD
    const dateFormatted = moment(date).format('MMM DD');

    return (     
        <div className='tweet__wrapper' onClick={() => window.open(`https://twitter.com/${twitterHandle}/status/${tweetID}`, "_blank") }>
            <div className='tweet__visual'>
                <div className='tweet__visual_profileimage '>
                    <img alt={`${twitterUserName} profile image`} src={twitterProfileImage}></img>
                </div>
            </div>
            <div className='tweet__body' >
                <div className='tweet__body_header'>
                    <h1 className='tweet__body_profilename font__twitter_bold'>{twitterUserName}</h1>
                    <h1 className='tweet__body_profiletag font__twitter_light'>@{twitterHandle}</h1>
                    <h1 className='tweet__body_date font__twitter_light'>{dateFormatted}</h1>
                </div>
                <div className='tweet__body_content'>
                    <Dotdotdot clamp={4}>
                        <p className='font__twitter_light'>{text}</p>
                    </Dotdotdot>
                </div>
            </div>
        </div>
    )
};

export default Tweet;
