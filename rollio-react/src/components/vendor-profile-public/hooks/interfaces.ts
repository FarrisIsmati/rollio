export enum accuracyAsyncStateEnum {
    LOADING = 'loading',
    FAILED = 'failed',
    DEFAULT = 'default'
}

export type AccuracyAsyncStatePayload = {
    [key: string]: string
}
