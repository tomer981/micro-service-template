// src/index.ts
import 'reflect-metadata';
import 'module-alias/register';

import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import logger from "jet-logger";

import { Server } from '@src/server';
import {ILogMessageQueueConfig} from "@src/interfaces/ILogMessageQueueConfig";
import { LogMessageController } from '@src/controllers/LogMessageController';
import { ErrorHandlerMiddleware } from '@src/middleware/ErrorHandlerMiddleware';
import {LogMessageService} from "@src/services/LogMessageService";
import {RabbitMqService} from "@src/services/RabbitMqService";
import {RabbitMqConfig} from "@src/config/RabbitMqConfig";
import { TOKENS } from '@src/common/InjectionTokens';
import {ILogMessageQueueService} from "@src/interfaces/ILogMessageQueueService";

Container.import([
    LogMessageService,
    RabbitMqService,
    RabbitMqConfig
]);
useContainer(Container);

export class App {
    public static async start(): Promise<void> {
        await this.initializeQueueServices();

        const app = createExpressServer({
            routePrefix: '/api',
            controllers: [LogMessageController],
            middlewares: [ErrorHandlerMiddleware],
            validation: {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: {
                    target: false,
                    value: true,
                },
            },
            defaultErrorHandler: true,
            classTransformer: true,
        });

        Server.setup(app);
        Server.startServer(app);
    }

    private static async initializeQueueServices(): Promise<void> {
        const logQueueConfig = Container.get<ILogMessageQueueConfig>(TOKENS.LogMessageQueueConfig);
        await logQueueConfig.initialize();

        const logQueueService = Container.get<ILogMessageQueueService>(TOKENS.LogMessageQueueService);
        await logQueueService.initialize();
    }
}

App.start().catch((error) => {
    logger.err('Error during app startup:', error);
});