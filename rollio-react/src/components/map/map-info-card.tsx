// DEPENDENCIES
import React from 'react';

// INTERFACES
import { MapInfoCardProps } from './interfaces';

const MapInfoCard = (props:MapInfoCardProps) => {
  const { name, profileImageLink, style, onClick } = props;

  return (
    <div className='map__infocard_wrapper' style={style}>
      <div className='map__infocard' onClick={onClick}>
        <div className='flex__verticle_center'>
          <div className='map__infocard_image'>
              <img alt={`${ name } logo`} src={ profileImageLink } />
          </div>

          <div className='map__infocard_text font__map_infocard_font flex__verticle_center'>
            <h2>{ name }</h2>
          </div>
        </div>

        <div className='map__infocard_icon'>
          <i className="material-icons-outlined">keyboard_arrow_right</i>
        </div>
      </div>
    </div>
  );
};

export default MapInfoCard