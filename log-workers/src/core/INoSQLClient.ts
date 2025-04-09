export interface INoSQLClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
