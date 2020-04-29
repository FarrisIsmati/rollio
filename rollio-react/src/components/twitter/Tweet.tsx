// DEPENDENCIES
import React, { ReactComponentElement } from 'react';
import Dotdotdot from 'react-dotdotdot'

const Tweet = () => {

    return (     
        <div className='tweet__wrapper'>
            <div className='tweet__visual'>
                <div className='tweet__visual_profileimage '></div>
            </div>
            <div className='tweet__body'>
                <div className='tweet__body_header'>
                    <h1 className='tweet__body_profilename font__twitter_bold'>dcfoodtrucks1</h1>
                    <h1 className='tweet__body_profiletag font__twitter_light'>@dcfoodtrucks1</h1>
                    <h1 className='tweet__body_date font__twitter_light'>Apr 27</h1>
                </div>
                <div className='tweet__body_content'>
                    <Dotdotdot clamp={4}>
                        <p className='font__twitter_light'>Noma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfd Noma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfd vNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfdNoma? a;skdjfa;kdflj as;kdf ljas;kdflkfkdkfdfaksfskfd</p>
                    </Dotdotdot>
                </div>
            </div>
        </div>
    )
};

export default Tweet;
