// DEPENDENCIES
import React, { FC, ReactElement } from 'react';

// COMPONENTS
import TextAreaGrow from '../common/text/textarea-grow';
import ButtonDefault from '../common/buttons/button-default';

// HOOKS
import useCommentAdd from './hooks/use-comment-add';

// ICONS
import { IconContext } from 'react-icons';
import { IoMdText } from 'react-icons/io';

const CommentAdd:FC = (props) => {
    const { 
        commentActive,
        commentBody,
        commentName,
        getNamePlaceHolder,
        getIsLocked,
        clickNameInput,
        changeText,
        commentBodyTextArea,
        blurComment,
        dispatchRequestPostVendorComment,
    } = useCommentAdd();

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
                        placeholder={getNamePlaceHolder()} 
                        maxLength={30} 
                        className='font__comment_add_content'/>
                </div>
            </div>

            <div className={ commentActive ? 'commentadd__text_body_active' : 'commentadd__text_body_inactive'}>
                <TextAreaGrow 
                    id='commentBodyTextArea' 
                    onChange={e=>changeText(e,'body')} 
                    onBlur={blurComment} 
                    value={commentBody} 
                    ref={commentBodyTextArea} 
                    placeholder={'Be the first to share your thoughts...'} 
                    className={'textarea__grow font__textarea_grow font__comment_add_content'}/>
                <ButtonDefault 
                    id={'commentAddButton'} 
                    text={'Share'} 
                    className={'button__comment_add font__button_comment_add'} 
                    isLocked={getIsLocked}
                    // GET A UNIQUE ID RETURNED 
                    // GET GET SHOW MORE LOCKED RESPONSIVE
                    // GET COMMENT TO BE ADDED WHEN ADDED
                    handleClick={dispatchRequestPostVendorComment}
                />
            </div>
        </div>
    )
    
}

export default CommentAdd;
