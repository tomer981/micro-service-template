export interface IQueueConfigClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getClient(): unknown;
}
