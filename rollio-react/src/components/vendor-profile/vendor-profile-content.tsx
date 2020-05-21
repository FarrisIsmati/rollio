// DEPENDENCIES
import React, { ReactElement } from 'react';
import { isActive } from '../../util/index';

// COMPONENTS
import Comments from '../comments/comment-section';
import VendorProfileContentItemToggle from './vendor-profile-content-item-toggle';
import Tweet from '../twitter/Tweet';
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import VendorProfileCategories from './vendor-profile-categories';

// HOOKS
import useToggleComponents from './hooks/use-toggle-components';
import useUpdateVendorLocationAccuracy from './hooks/use-update-vendor-location-accuracy';

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

    const tweets = state.data.selectedVendor.tweetHistory.map((tweetData:any) => <Tweet 
      key={tweetData.tweetID}
      twitterUserName={state.data.selectedVendor.twitterUserName} 
      twitterHandle={state.data.selectedVendor.twitterHandle} 
      twitterProfileImage={state.data.selectedVendor.profileImageLink}
      tweetData={tweetData}
    />)

    // HOOKS
    const {components, toggleComponents} = useToggleComponents(vendor.id, {
      ABOUT: false,
      TWITTER: false,
    });

    // Needs to be configured to use multiple trucks
    const { updateVendorLocationAccuracy } = useUpdateVendorLocationAccuracy(state.data.regionId,state.data.selectedVendor.id);

    const vendorAccuracyComponent = (locationID:string) => {
      return (
        <div className='vendorprofile__info_address_accuracy font__vendor_profile_info'>
          <h2 className='vendorprofile__info_address_accuracy_number'>1</h2>
          <i onClick={() => updateVendorLocationAccuracy(1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_plus">add</i>
          <i onClick={() => updateVendorLocationAccuracy(-1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_minus">remove</i>
        </div>
      )
    }

    // Vendor Address Component
    const vendorAddressComponent = () => {
      const setAddress = (address:ReactElement, locationID:string, i:number|null = null) => (
        <div key={locationID} className='vendorprofile__info_row_clickable'>
            <div className='vendorprofile__info_icon_wrapper'>
              <i className="material-icons-outlined">room</i> 
            </div>
            <div className='vendorprofile__info_address vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
              <h2 onClick={ () => findOnMap(vendor.locations[i !== null ? i : 0]) }>
                { i !== null ? state.data.selectedVendor.locations[i].address : state.data.selectedVendor.locations[0].address }
              </h2>
            </div>
            {/* Empty div to properly order row/columns */}
            <div></div> 
            { vendorAccuracyComponent(locationID) }
          </div>
      )

      if (vendor.locations.length > 1) {
        return vendor.locations.map((location:any, i:number) => {
          return setAddress(<h2 key={location._id} onClick={ () => findOnMap(location) }>{location.address}</h2>, location._id, i);
        })
      }
      return setAddress(<h2 onClick={ () => findOnMap(vendor.locations[0]) }>{state.data.selectedVendor.locations[0].address}</h2>, vendor.locations[0]._id)
    }

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

            {/* <i className="material-icons-outlined" onClick={() => updateVendorLocationAccuracy(1)}>thumb_up</i>
            <i className="material-icons-outlined" onClick={() => updateVendorLocationAccuracy(-1)}>thumb_down</i> */}

            { isActive(vendor) ? vendorAddressComponent() : null }

            { vendor.website ?
              <div className='vendorprofile__info_row_clickable'>
                <div className='vendorprofile__info_icon_wrapper'>  
                  <i className="material-icons-outlined">web</i> 
                </div>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  { vendor.website ? <h2><a target='_blank' href={vendor.website}>WEBSITE</a></h2> : <h2>WEBSITE UNAVAILABLE</h2> }
                </div>
              </div> :
              null
            }

            { vendor.phoneNumber ?
              <div className='vendorprofile__info_row_clickable'>
                <div className='vendorprofile__info_icon_wrapper'>
                  <i className="material-icons-outlined">local_phone</i>
                </div>
                <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                  { vendor.phoneNumber ? <h2><a href={`tel:${vendor.phoneNumber}`}>{vendor.phoneNumber}</a></h2> : <h2>PHONE UNAVAILABLE</h2> }
                </div>
              </div> :
              null
            }

            <VendorProfileContentItemToggle iconFa={ faTwitter } components={components} toggleComponents={toggleComponents} componentName='twitter'>
              { tweets }
            </VendorProfileContentItemToggle>

            <VendorProfileContentItemToggle iconMa='local_shipping' components={components} toggleComponents={toggleComponents} componentName='about'>
              <p>{vendor.description}</p>
            </VendorProfileContentItemToggle>
    
            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper_alt'>
                <i className="material-icons-outlined">credit_card</i>
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info_alt flex__verticle_center'>
                { vendor.creditCard === 'y' ? <h2>Accepts Credit Cards</h2> : <h2>Doesn't Accept Credit Card</h2>}
              </div>
            </div>

            <div className='vendorprofile__comments_wrapper'>
              <h2 className='vendorprofile__comments_header font__vendor_profile_header_alt'>Comments</h2>
              <Comments comments={state.data.selectedVendor.comments}/>
            </div>
          </div>
        </React.Fragment>
    )
};

export default VendorProfileContent;
