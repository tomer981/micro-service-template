// src/services/LogMessageService.ts
import {Inject, Service} from 'typedi';
import {ILogMessageService} from "@src/interfaces/ILogMessageService";
import {TOKENS} from "@src/common/InjectionTokens";
import {ILogMessageQueueService} from "@src/interfaces/ILogMessageQueueService";
import {LogLevel} from "@src/common/LogLevel";

@Service(TOKENS.LogMessageService)
export class LogMessageService implements ILogMessageService {
    constructor(
        @Inject(TOKENS.LogMessageQueueService) private readonly logMessageQueueService: ILogMessageQueueService
    ) {}

    async pushMessageToTheQueue(playerId: string, logData: string, logLevel: LogLevel): Promise<void> {
        await this.logMessageQueueService.pushLogMessageToQueue(playerId, logData, logLevel);
    }
}
