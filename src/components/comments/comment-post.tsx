// DEPENDENCIES
import React, {FC} from 'react';
import moment from 'moment';

interface CommentPostProps  {
  time: string,
  name: string,
  text: string
}

const CommentPost = (props: CommentPostProps) => {
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
  }

  return (
    <div className="commentpost__wrapper"> 
        <div className="commentpost__header_wrapper">
            <p className="font__comment_posted_name">{ props.name }</p>
            <p className="font__comment_posted_time">{ time }</p>
        </div>
        <div className="commentpost__content_wrapper">
            <p className="font__comment_posted_content">{ props.text }</p>
        </div>
    </div>
  );
}


export default CommentPost;
