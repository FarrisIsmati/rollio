// DEPENDENCIES
import React, { FC, ReactElement } from 'react';

// HOOKS
import useCommentAdd from './hooks/use-comment-add';

// ICONS
import { IconContext } from 'react-icons';
import { IoMdText } from 'react-icons/io';

const CommentAdd:FC = () => {
    const { text, handleChange } = useCommentAdd();

    const CommentAddName:ReactElement = (
        <div id="commentAddName" className='commentadd__text_wrapper commentadd__text_name'>
            <input id="commentAddName" type='text' placeholder='Add your name (optional)' maxLength={30} className='font__comment_add_content'/>
        </div>
    )
    
    // MAKE A CUSTOM TEXT AREA
    const CommentAddText:ReactElement = (
        <div className={ text === '' ? 'commentadd__text_wrapper' : 'commentadd__text_body_active commentadd__text_wrapper'}>
            <input id="commentAddText" type='text' value={text} onChange={handleChange} placeholder='Be the first to share your thoughts...' className='font__comment_add_content'/>
        </div>
    )

    const CommentTopHalf:Function = (element:ReactElement) => {
        return (
            <div className='commentadd__tophalf'>
                <IconContext.Provider value={{ size: '32', className: 'commentadd__icon_type_text' }}>
                    <div>
                        <IoMdText/>
                    </div>
                </IconContext.Provider>
                { element }
            </div>
        )
    }

    const CommentTypingState:ReactElement = (
        <div className="commentadd__active_wrapper">
            { CommentTopHalf(CommentAddName) }
            { CommentAddText }
        </div>
    )
    
    return (
        <div className='commentadd__wrapper'>
            { text === '' ? CommentTopHalf(CommentAddText) : CommentTypingState }
        </div>
    )
    
}

export default CommentAdd;
