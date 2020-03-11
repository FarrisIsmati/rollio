export interface MenuLinkProps  {
    name: string,
    id: string,
    img?: string
  }

export interface UseToggleVendorMenuOnScreenSwitchProps {
  expandedMenuStyle: {
    height: string,
    transition: string,
    transitionTimingFunction: string
  },
  topRef: React.MutableRefObject<any>
}