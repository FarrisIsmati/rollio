// INTERFACES
import { MapDefaultState } from '../../redux/reducers/interfaces';

export interface MapProps  {
    mapType: string,
    mapData: MapDefaultState,
  }

export interface DesktopInfoCardProps {
  width?: string,
  padding?: string,
  marginLeft?: string
}

  export interface MapInfoCardProps {
    name: string,
    profileImageLink: string,
    style?: DesktopInfoCardProps
    onClick: () => any
  }