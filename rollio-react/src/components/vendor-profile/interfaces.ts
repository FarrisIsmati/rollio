export type VendorProfileToggleComponentProps = {
    componentName: string,
    components: any,
    toggleComponents: any,
    children: any,
    iconMa?: string,
    iconFa?: any,
} & ( { iconMa: string } | { iconFa: any } )
