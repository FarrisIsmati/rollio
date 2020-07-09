export interface MenuLinkProps  {
  name: string,
  id: string,
  img?: string
}

export interface DashboardCardProps {
  vendor: any,
  img: string
}

export interface UseToggleVendorDashboardOnScreenSwitchProps {
  expandedDashboardStyle: {
    height: string,
    transition: string,
    transitionTimingFunction: string
  },
  topRef: React.MutableRefObject<any>
}