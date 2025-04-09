// src/interfaces/ILogMessageQueueConfig.ts

export interface ILogMessageQueueConfig {
    initialize(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getClient(): any //Note: used any because can be replace with other services
}