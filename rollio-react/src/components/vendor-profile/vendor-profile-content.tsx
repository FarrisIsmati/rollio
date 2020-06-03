// DEPENDENCIES
import React from 'react';
import { isActive } from '../../util/index';

// COMPONENTS
import Comments from '../comments/comment-section';
import VendorProfileContentItemToggle from './vendor-profile-content-item-toggle';
import Tweet from '../twitter/Tweet';
import VendorProfileCategories from './vendor-profile-categories';
import VendorProfileContentAccuracy from './vendor-profile-content-accuracy';

// HOOKS
import useToggleComponents from './hooks/use-toggle-components';

interface VendorProfileContentProps  {
    isMobile: boolean,
    closeVendor?: any,
    findOnMap: any,
    vendor: any,
    state: any
}

const VendorProfileContent = (props:VendorProfileContentProps) => {
    const { 
      isMobile, 
      closeVendor, 
      findOnMap, 
      vendor, 
      state,
    } = props;

    const tweets = vendor.tweetHistory.map((tweetData:any) => <Tweet 
      key={tweetData.tweetID}
      twitterUserName={vendor.twitterUserName} 
      twitterHandle={vendor.twitterHandle} 
      twitterProfileImage={vendor.profileImageLink}
      tweetData={tweetData}
    />)

    // HOOKS
    const {components, toggleComponents} = useToggleComponents(vendor.id, {
      LOCATIONS: false,
      MOREINFO: false,
      TWITTER: false,
      COMMENTS: false,
    });

    return (
        <React.Fragment>
        {/* Show or don't show close out X in profile image depending on Mobile or Desktop */}
          { isMobile ?
            <div className='vendorprofile__image_wrapper'>
                <div className='vendorprofile__image'>
                    <img alt={`${vendor.name} logo`} src={vendor.bannerImageLink} />
                </div>
            </div> :
            <div className='vendorprofile__image_wrapper'>
                <div className='vendorprofile__image'>
                <div className="vendorprofile__close_wrapper">
                    <i className="material-icons-outlined" onClick={closeVendor}>close</i>
                </div>
                <img alt={`${vendor.name} logo`} src={vendor.bannerImageLink} />
                </div>
            </div>
          }

          <div className='font__vendor_profile_title vendorprofile__title_wrapper'>
            <h2>{vendor.name}</h2>
          </div>

          <div className='vendorprofile__categories_wrapper'>
            < VendorProfileCategories vendor={vendor} />
          </div>

          <div className='vendorprofile__info_wrapper'>
            {/* Locations */}
            { vendor.locations.length ?
            <React.Fragment>
              <div className='vendorprofile__info_row'>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  <h2>Locations</h2>
                </div>
              </div>

              <div className={`vendorprofile__info_row_expanded font__vendor_profile_info_desc`}>
                  <VendorProfileContentAccuracy state={state} vendor={vendor} findOnMap={findOnMap}/>
              </div>
            </React.Fragment> :
              null
            }

            {/* Tweets */}
            { vendor.tweetHistory.length ? 
              <VendorProfileContentItemToggle components={components} toggleComponents={toggleComponents} componentName='TWITTER' componentDisplayName='twitter feed'>
                { tweets }
              </VendorProfileContentItemToggle> :
              null
            }

            <VendorProfileContentItemToggle components={components} toggleComponents={toggleComponents} componentName='MOREINFO' componentDisplayName='more info'>
              {/* Description */}
              <div className ='vendorprofile__info_detail'>
                <div className='vendorprofile__info_icon_wrapper_alt'>
                  <i className='material-icons-outlined'>local_shipping</i>
                </div>
                <p>{vendor.description}</p>
              </div>

              {/* Website */}
              <div className ='vendorprofile__info_detail'>
                <div className='vendorprofile__info_icon_wrapper_alt_center'>
                  <i className="material-icons-outlined">web</i> 
                </div>

                { vendor.website ? <p className='flex__verticle_center'><a target='_blank' href={vendor.website}>Website</a></p> : <p className='vendorprofile__info_detail_unavailable flex__verticle_center'>Website Unavailable</p> }
              </div>

              {/* Phone Number */}
              <div className ='vendorprofile__info_detail'>
                <div className='vendorprofile__info_icon_wrapper_alt_center'>
                  <i className="material-icons-outlined">local_phone</i>
                </div>

                { vendor.phoneNumber ? <p className='flex__verticle_center'><a href={`tel:${vendor.phoneNumber}`}>{vendor.phoneNumber}</a></p> : <p className='vendorprofile__info_detail_unavailable flex__verticle_center'>Phone Unavailable</p> }
              </div>

              {/* Credit Card */}
              <div className='vendorprofile__info_detail'>
                <div className='vendorprofile__info_icon_wrapper_alt_center'>
                  <i className="material-icons-outlined">credit_card</i>
                </div>

                { vendor.creditCard === 'y' ? <p className='flex__verticle_center'>Accepts Credit Cards</p> : <p className='vendorprofile__info_detail_unavailable flex__verticle_center'>Doesn't Accept Credit Card</p>}
              </div>
            </VendorProfileContentItemToggle>

            {/* Comments */}
            <VendorProfileContentItemToggle components={components} toggleComponents={toggleComponents} componentName='COMMENTS' componentDisplayName='comments'>
              <div className='vendorprofile__comments_wrapper'>
                <Comments comments={vendor.comments}/>
              </div>
            </VendorProfileContentItemToggle>


          </div>
        </React.Fragment>
    )
};

export default VendorProfileContent;
