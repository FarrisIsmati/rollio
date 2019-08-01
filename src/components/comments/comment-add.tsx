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
    const { commentActive, commentBody, commentName, namePlaceHolder, clickNameInput, changeText, commentBodyTextArea, blurComment } = useCommentAdd();
    console.log(commentBodyTextArea)
    return (
        <div className='commentadd__wrapper'>
            <div className='commentadd__tophalf'>
                <IconContext.Provider value={{ size: '32', className: 'commentadd__icon_type_text' }}>
                    <div>
                        <IoMdText/>
                    </div>
                </IconContext.Provider>
                {/* Optional Add name but place holder and class changes on click */}
                <div className={ commentActive ? 'commentadd__text_name_active commentadd__text_wrapper' : 'commentadd__text_name_inactive commentadd__text_wrapper'}>
                    <input 
                        id="commentNameInput" 
                        type='text'
                        tabIndex={0} 
                        value={commentName} 
                        onBlur={blurComment} 
                        onFocus={clickNameInput} 
                        onChange={e=>{changeText(e,'name')}} 
                        placeholder={namePlaceHolder()} 
                        maxLength={30} 
                        className='font__comment_add_content'/>
                </div>
            </div>

            <div className={ commentActive ? 'commentadd__text_body_active commentadd__text_wrapper' : 'commentadd__text_body_inactive commentadd__text_wrapper'}>
                <TextAreaGrow 
                    id='commentBodyTextArea' 
                    onChange={e=>changeText(e,'body')} 
                    onBlur={blurComment} 
                    value={commentBody} 
                    ref={commentBodyTextArea} 
                    placeholder={'Be the first to share your thoughts...'} 
                    className={'textarea__grow font__textarea_grow font__comment_add_content'}/>
            </div>
        </div>
    )
    
}

export default CommentAdd;
