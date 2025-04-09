// src/services/interfaces/ILogMessageService.ts
import {LogLevel} from "@src/common/LogLevel";

export interface ILogMessageService {
    pushMessageToTheQueue(playerId: string, logData: string, logLevel: LogLevel): Promise<void>;
}
