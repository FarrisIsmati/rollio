export const getRegion = (regionsAll:any, lookUpKey:string, lookUpValue:string) => {
    return lookUpValue && regionsAll.find((region:any) => region[lookUpKey].toString() === lookUpValue);
};
