// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import Comments from '../comments/comment-section';
import Chip from '../common/other/chip';
import VendorProfileContent from './vendor-profile-content';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import useScrollPosition from '../common/hooks/use-scroll-position';
import useGetHeight from './hooks/use-get-vendor-profile-height';

// ACTIONS
import { 
  deSelectVendor 
} from '../../redux/actions/data-actions';

// Returns an array of categories
const setCategoriesComponent = (args:any) => {
  const {isLoaded, vendor} = args;

  let Categories:ReactComponentElement<any>[] = [];

  if (isLoaded) {
    Categories = vendor.categories.map((category:string) => {
      return <Chip key={category} text={category} />
    })
    if (vendor.price) {
      Categories.unshift(<Chip key={vendor.price} text={vendor.price}/>)
    }
  }

  return Categories;
}

const VendorProfile = React.forwardRef((props:any, navbarRef)=> {
  // Refs
  const profileTopBarRef:any = useRef();

  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();
  // Height of the entire vendor profile (window height - navbarRef height)
  const vendorProfileHeight = useGetHeight(navbarRef) + 'px';


  // Height of the content minus ()
  const vendorProfileContentHeight = useGetHeight(profileTopBarRef) + 'px';

  const handleScroll = useScrollPosition({
    isLoaded: state.loadState.isVendorLoaded, 
    cb: windowSizeEffects.useIsMobile() ? props.scrollPositionCb : ()=>{}
  });

  // Quick variable references
  const isMobile = windowSizeEffects.useIsMobile();
  const isVendorSelected = state.ui.isVendorSelected;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  // Custom Vendor Profile Components
  const Categories:ReactComponentElement<any>[] = setCategoriesComponent({isLoaded, vendor});
  
  // Variant Styles
  const vendorProfileClassType = isMobile ? 'vendorprofile_mobile' : 'vendorprofile'
  
  // Difference between the Desktop and Mobile version is how it scrolls the content
  return (
    <div className={isVendorSelected ? `${vendorProfileClassType}__wrapper` : `${vendorProfileClassType}__wrapper_hidden`}>
      { !isMobile ? 
        // Desktop version
        <Scrollbars 
          style={{ width: isMobile ? '100%': '432px', height: vendorProfileHeight }} 
          onScroll={handleScroll}
          // Hide scrollbar when vendor profile is being animated closed
          renderThumbVertical={            
            ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} /> 
          }
        >
        { isLoaded ? <VendorProfileContent isMobile={isMobile} onClickClose={() => dispatch(deSelectVendor(vendor.id))} vendor={vendor} Categories={Categories} state={state} /> : <p>loading...</p>}
      </Scrollbars> 
      
      :
      // Mobile version
      <React.Fragment>
        { isLoaded ? 
          <React.Fragment>
            <div ref={profileTopBarRef} className='font__vendor_profile_header vendorprofile__topbar_wrapper'>
              <h2>{vendor.name}</h2>
              <div className='vendorprofile__x_wrapper'>
                <i className="material-icons-outlined" onClick={()=>{dispatch(deSelectVendor(vendor.id))}}>close</i>
              </div>
            </div>

            <Scrollbars 
              style={{ width: isMobile ? '100%': '432px', height: vendorProfileContentHeight }} 
              onScroll={handleScroll}
              // Hide scrollbar when vendor profile is being animated closed
              renderThumbVertical={            
                ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} /> 
              }
            >
              <VendorProfileContent isMobile={isMobile} onClickClose={() => dispatch(deSelectVendor(vendor.id))} vendor={vendor} Categories={Categories} state={state} />
            </Scrollbars>
          </React.Fragment> : <p>loading...</p>}
        </React.Fragment>
      }
    </div>
  );
});

export default VendorProfile;
