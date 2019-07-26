// DEPENDENCIES
import React from 'react';

// ICONS
import { IconContext } from 'react-icons';
import { IoMdText } from 'react-icons/io';

const CommentAdd = () => {
    // Add a div right next to text icon for adding a name (hidden)
    // Add a share button (hidden)
    // On click input event (Consider just rendering an entirely new component? idk man)
        // When clicked name div shows up
        // Hidden share button shows up
        // input div grows to min desired expanded height
        // typing starts saving to hook state


  return (
    <div className='commentadd__wrapper'> 
        <IconContext.Provider value={{ size: '32', className: 'commentadd__icon_type_text' }}>
            <div>
                <IoMdText/>
            </div>
        </IconContext.Provider>
        <div className='commentadd__text_wrapper'>
            <input type='text' placeholder='Be the first to share your thoughts...' className='font__comment_add_content'/>
        </div>
    </div>
  );
}


export default CommentAdd;
