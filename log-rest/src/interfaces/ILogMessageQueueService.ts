// src/services/interfaces/ILogMessageQueueService.ts
import {LogLevel} from "@src/common/LogLevel";

export interface ILogMessageQueueService {
    initialize(): Promise<void>;
    pushLogMessageToQueue(playerId:string,logData: string,logLevel: LogLevel): Promise<void>;
}