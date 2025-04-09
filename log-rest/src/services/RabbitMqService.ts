// src/services/RabbitMqService.ts
import {Inject, Service} from "typedi";
import {TOKENS} from "@src/common/InjectionTokens";
import {ILogMessageQueueService} from "@src/interfaces/ILogMessageQueueService";
import {LogLevel, LogLevelSeverity} from "@src/common/LogLevel";
import {ILogMessageQueueConfig} from "@src/interfaces/ILogMessageQueueConfig";
import {Client, Publisher} from "rabbitmq-stream-js-client";
import ENV from "@src/common/ENV";
import {Message} from "rabbitmq-stream-js-client/dist/publisher";

@Service(TOKENS.LogMessageQueueService)
export class RabbitMqService implements ILogMessageQueueService {
    publisher: Publisher | null = null;
    constructor(
        @Inject(TOKENS.LogMessageQueueConfig) private readonly logMessageQueueConfig: ILogMessageQueueConfig
    ) {
    }

    public async initialize() {
        await this.createPublisher();
    }

    private async createPublisher(){
        const client = this.logMessageQueueConfig.getClient()
        if (client instanceof Client){
            this.publisher = await client.declarePublisher({ stream: ENV.RabbitmqQueueLogs })
        }
    }

    async pushLogMessageToQueue(playerId: string, logData: string, logLevel: LogLevel): Promise<void> {
        if (!this.publisher) {
            throw new Error('RabbitMQ channel not initialized. Ensure the connection is established.');
        }

        const messages: Message[] = [
            {
                content: Buffer.from(JSON.stringify({logData , playerId})),
                // messageProperties: {
                //     creationTime: new Date(Date.now()),
                // },
                messageHeader: {
                    priority: LogLevelSeverity[logLevel],
                    durable: true,
                },
            },
        ];

        await this.publisher.sendSubEntries(messages);
    }
}