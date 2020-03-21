// INTERFACES
import { MapDefaultState } from '../../redux/reducers/interfaces';

export interface MapProps  {
    mapType: string,
    mapData: MapDefaultState
  }

  export interface MapInfoCardProps {
    name: string,
    profileImageLink: string,
    onClick: () => any
  }