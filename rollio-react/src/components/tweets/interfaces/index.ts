export interface VendorNameAndId {
    _id: string,
    name: string
};

export interface Tweet {
    tweetID: string,
    date: Date,
    text: string,
    location: any,
    vendorID: any,
    usedForLocation: boolean,
    vendorName?: string
};

export const TweetDefaultState = {
    tweetID: '',
    date: new Date(),
    text: '',
    location: {},
    vendorID: {},
    usedForLocation: false
};
