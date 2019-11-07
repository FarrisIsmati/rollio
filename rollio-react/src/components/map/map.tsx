// DEPENDENCIES
import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

// HOOKS
import useMapMarkers from './hooks/useMapMarkers';

// CONFIG
import { MAPBOX_API_KEY } from '../../config'

// INTERFACES
import { MapProps } from './interfaces';

const mapMarkerElement:any = (<div>lol</div>)

const Map = (props: MapProps) => {
  const { mapType, mapData } = props;

  const [map, setMap] = useState<any>(null);
  const mapContainer = useRef<any>(null);

  useEffect(() => {
    //@ts-ignore
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const initializeMap = ({ setMap, mapContainer } : { setMap: any, mapContainer: any}) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/farrisismati/ck04ma9xw0mse1cp25m11fgqs',
        center: [-77.0369, 38.9072],
        zoom: 12,
        interactive: true
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    // If that map has not been rendered, render it
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map])

  // Should reupdate everytime the map updates
  useMapMarkers({...props, map, mapMarkerElement})

  return (
    <div className='map__wrapper'>
      <div ref={el => (mapContainer.current = el)}></div>
    </div>
  );
}

Map.propTypes = {
  mapType: PropTypes.string.isRequired,
}

Map.defaultProps  = {
  mapType: 'region'
}

export default Map;

