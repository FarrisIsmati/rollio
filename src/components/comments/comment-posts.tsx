// DEPENDENCIES
import React, { useState, useEffect } from 'react';

// COMPONENTS
import ButtonDefault from '../common/buttons/button-default';

// HOOKS
import useRenderPosts from './hooks/use-render-posts';

const CommentPosts = (props: any) => {
    const { shownComments, ShowMoreComments } = useRenderPosts(props);

    return (
      <div className='commentposts__wrapper'>
        { shownComments }
        <ButtonDefault 
          id={'commentShowMoreButton'} 
          text={'Show More'} 
          className={'button__default_wide font__button_comment_showmore'}
          isLocked={() => shownComments.length === props.comments.length}
          handleClick={ShowMoreComments}
        />
      </div>
    )
  }
  
export default CommentPosts