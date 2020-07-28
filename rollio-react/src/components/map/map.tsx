// DEPENDENCIES
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect } from 'react';

// COMPONENTS
import MapInfoCard from './map-info-card';
import MapOverlay from './map-overlay'

// HOOKS
import useGetInfoCardData from './hooks/useGetInfoCardData';
import useMapMarkers from './hooks/useMapMarkers';
import useGlobalState from '../common/hooks/use-global-state';
import useWindowSize from '../common/hooks/use-window-size';
import useGetAppState from '../common/hooks/use-get-app-state';

// CONFIG
import { MAPBOX_API_KEY } from '../../config'

// INTERFACES
import { MapProps, DesktopInfoCardProps } from './interfaces';

const mapMarkerElement:any = (<div></div>)

const Map = (props: MapProps) => {
  const state = useGetAppState();
  const [globalState, setGlobalState] = useGlobalState();
  const mapContainer = useRef<any>(null);
  const infoCardData = useGetInfoCardData();
  const isMobile = useWindowSize.useIsMobile();

  const showMapInfoCard = !state.ui.isMobileMenuExpanded && state.regionMap.currentlySelected.length;
  const infoCardWidth = 450;
  const infoCardStyle: DesktopInfoCardProps = {
    width: `${infoCardWidth}px`
  }
  if (mapContainer.current) {
    infoCardStyle.padding = '0';
    infoCardStyle.marginLeft = `${(mapContainer.current.offsetWidth / 2) - (infoCardWidth / 2)}px`
  }

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
        setGlobalState({ ...globalState, map: map });
        map.resize();
      });

    };

    // If that map has not been rendered, render it
    if ( !mapContainer.current.classList.contains('mapboxgl-map')) {
      initializeMap({ mapContainer })
    }

    return () => {
      if (globalState.map) {
        globalState.map.remove();
      }
      setGlobalState({ ...globalState, map: null });
    }
  }, [])
  
  // Should reupdate everytime the map updates
  useMapMarkers({...props, map: globalState.map, mapMarkerElement})

  return (
    <div className={isMobile ? 'map_mobile' : 'map_desktop'}>
      {/* Map Overlay only for mobile */}
      <MapOverlay />

      { showMapInfoCard ? <MapInfoCard name={ infoCardData.name } profileImageLink={ infoCardData.profileImageLink } style={ infoCardStyle } onClick={ infoCardData.onClick } /> : null }

      <div ref={el => (mapContainer.current = el)}></div>
    </div>
  );
}

export default Map;
