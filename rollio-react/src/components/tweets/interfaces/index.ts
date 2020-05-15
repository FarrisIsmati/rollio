export interface VendorNameAndId {
    _id: string,
    name: string
};

export interface Tweet {
    tweetID: string,
    date: Date,
    text: string,
    locations: any[],
    vendorID: any,
    usedForLocation: boolean,
    vendorName?: string
};

export const TweetDefaultState = {
    tweetID: '',
    date: new Date(),
    text: '',
    locations: [],
    vendorID: {},
    usedForLocation: false
};
