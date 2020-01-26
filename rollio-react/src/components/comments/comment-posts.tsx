// DEPENDENCIES
import React from 'react';

// COMPONENTS
import ButtonBare from '../common/buttons/button-bare';

// HOOKS
import useRenderPosts from './hooks/use-render-posts';

const CommentPosts = (props: any) => {
    const { shownComments, ShowMoreComments } = useRenderPosts(props);

    return (
      <div className='commentposts__wrapper'>
        { shownComments }
        <div className='commentposts__button_wrapper'>
          <ButtonBare 
            id={'commentShowMoreButton'} 
            text={'READ MORE'} 
            className={'font__button_comment_showmore'}
            isLocked={() => shownComments.length === props.comments.length}
            handleClick={ShowMoreComments}
          />
        </div>
      </div>
    )
  }
  
export default CommentPosts