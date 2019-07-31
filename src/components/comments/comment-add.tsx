// DEPENDENCIES
import React, { FC, ReactElement } from 'react';

// COMPONENTS
import TextAreaGrow from '../common/text/textarea-grow';

// HOOKS
import useCommentAdd from './hooks/use-comment-add';

// ICONS
import { IconContext } from 'react-icons';
import { IoMdText } from 'react-icons/io';

const CommentAdd:FC = () => {
    const { commentActive, commentBody, commentName, namePlaceHolder, clickNameInput, changeText, commentBodyInput, blurComment } = useCommentAdd();

    return (
        <div className='commentadd__wrapper'>
            <div className='commentadd__tophalf'>
                <IconContext.Provider value={{ size: '32', className: 'commentadd__icon_type_text' }}>
                    <div>
                        <IoMdText/>
                    </div>
                </IconContext.Provider>
                {/* Optional Add name but place holder and class changes on click */}
                <div id="commentAddName" className={ commentActive ? 'commentadd__text_name_active commentadd__text_wrapper' : 'commentadd__text_name_inactive commentadd__text_wrapper'}>
                    <input id="commentAddNamey" type='text' tabIndex={0} value={commentName} onBlur={blurComment} onFocus={clickNameInput} onChange={e=>{changeText(e,'name')}} placeholder={namePlaceHolder()} maxLength={30} className='font__comment_add_content'/>
                </div>
            </div>

            {/* CUSTOM TEXT AREA NOW */}
            <div className={ commentActive ? 'commentadd__text_body_active commentadd__text_wrapper' : 'commentadd__text_body_inactive commentadd__text_wrapper'}>
                <input id="commentBody" type='text' tabIndex={0} onBlur={blurComment} ref={commentBodyInput} value={commentBody} onChange={e=>changeText(e,'body')} placeholder='Be the first to share your thoughts...' className='font__comment_add_content'/>
                <TextAreaGrow id='commentBodyTextArea' onChange={e=>changeText(e,'body')} onBlur={blurComment}></TextAreaGrow>
            </div>
        </div>
    )
    
}

export default CommentAdd;
