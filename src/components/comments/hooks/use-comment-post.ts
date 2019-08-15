// DEPENDENCIES
import moment from 'moment';

const useCommentPost = (props: any) => {
    // Gets the time posted and the current time difference from now
    const GetTime = () => {
        let time = props.time;
        let m = moment(time);

        // Sometimes date will go not available on a quick mNow and redux formatted Date.now() diff
        if (!m.isValid()) {
          m = moment(Date.now());
        }

        const mNow = moment(Date.now())
        const minutes = Math.floor(mNow.diff(m, 'minutes', true));
        const hours = Math.floor(mNow.diff(m, 'hours', true));
        const days = Math.floor(mNow.diff(m, 'days', true));
        const weeks = Math.floor(mNow.diff(m, 'weeks', true));

        // Sometimes minutes will go negative on a quick mNow and Date.now() diff
        if (minutes < 0) {
          time = `0m`;
        } else if (minutes < 60) {
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