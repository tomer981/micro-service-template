// src/common/InjectionTokens.ts
import {Token} from "typedi";
import {ILogMessageService} from "@src/interfaces/ILogMessageService";
import {ILogMessageQueueService} from "@src/interfaces/ILogMessageQueueService";
import {ILogMessageQueueConfig} from "@src/interfaces/ILogMessageQueueConfig";

export const TOKENS = {
    LogMessageService: new Token<ILogMessageService>('LogMessageService'),
    LogMessageQueueService: new Token<ILogMessageQueueService>('LogMessageQueueService'),
    LogMessageQueueConfig: new Token<ILogMessageQueueConfig>('LogMessageQueueConfig'),
};