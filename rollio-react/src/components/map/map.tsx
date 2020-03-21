// DEPENDENCIES
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect } from 'react';

// COMPONENTS
import MapInfoCard from './map-info-card';
import MapOverlay from './map-overlay'

// HOOKS
import useShowInfoCard from './hooks/useShowInfoCard';
import useGetInfoCardData from './hooks/useGetInfoCardData';
import useMapMarkers from './hooks/useMapMarkers';
import useGlobalState from '../common/hooks/use-global-state';

// CONFIG
import { MAPBOX_API_KEY } from '../../config'

// INTERFACES
import { MapProps } from './interfaces';

const mapMarkerElement:any = (<div></div>)

const Map = (props: MapProps) => {
  // Effects
  const [globalState, setGlobalState] = useGlobalState();
  const mapContainer = useRef<any>(null);
  const showInfoCard = useShowInfoCard();
  const infoCardData = useGetInfoCardData();
  
  useEffect(() => {
    //@ts-ignore
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const initializeMap = ({ mapContainer } : { mapContainer: any}) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/farrisismati/ck04ma9xw0mse1cp25m11fgqs',
        center: [-77.0369, 38.9072],
        zoom: 12,
        interactive: true
      });

      map.on("load", () => {
        setGlobalState({ map });
        map.resize();
      });
    };

    // If that map has not been rendered, render it
    if (!globalState.map) initializeMap({ mapContainer });
  }, [globalState.map])

  // Should reupdate everytime the map updates
  useMapMarkers({...props, map: globalState.map, mapMarkerElement})

  return (
    <div className='map__wrapper'>
      {/* Map OVerlay only for mobile */}
      <MapOverlay />
      {/*  Show if currentlySelected && !isMobileMenuExpanded */}
      { showInfoCard ? <MapInfoCard name={ infoCardData.name } profileImageLink={ infoCardData.profileImageLink } onClick={ infoCardData.onClick } /> : null }
      <div ref={el => (mapContainer.current = el)}></div>
    </div>
  );
}

export default Map;

