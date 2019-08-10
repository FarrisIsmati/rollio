// DEPENDENCIES
import moment from 'moment';

const useCommentPost = (props: any) => {
    // Gets the time posted and the current time difference from now
    const GetTime = () => {
        let time = props.time;
        const m = moment(time);
        const mNow = moment(Date.now())
        const minutes = Math.floor(mNow.diff(m, 'minutes', true));
        const hours = Math.floor(mNow.diff(m, 'hours', true));
        const days = Math.floor(mNow.diff(m, 'days', true));
        const weeks = Math.floor(mNow.diff(m, 'weeks', true));
        
        if (minutes < 60) {
          time = `${minutes}m`;
        } else if (hours < 24) {
          time = `${hours}h`;
        } else if (days < 7) {
          time = `${days}d`;
        } else {
          time = `${weeks}w`;
        }

        return time
    }

    return {
        GetTime
    }
}

export default useCommentPost;