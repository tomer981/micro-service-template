// src/config/RabbitMqConfig.ts
import {Service} from 'typedi';
import {ILogMessageQueueConfig} from "@src/interfaces/ILogMessageQueueConfig";
import {Client, connect} from "rabbitmq-stream-js-client";
import logger from "jet-logger";
import ENV from "@src/common/ENV";
import {TOKENS} from "@src/common/InjectionTokens";

@Service(TOKENS.LogMessageQueueConfig)
export class RabbitMqConfig implements ILogMessageQueueConfig {
    client: Client | null = null;

    async initialize() {
        await this.connect()
        await this.createStream(ENV.RabbitmqQueueLogs, 5 * 1e9)
    }

    private async createStream(streamName: string, size: number): Promise<any>{
        if (this.client) {
            return await this.client.createStream({
                stream: streamName,
                arguments: {'max-length-bytes': size},
            });
        }
    }

    async connect(): Promise<void> {
        try {
            if (this.client) {
                return
            }

            const connectionParams = {
                hostname: ENV.RabbitmqUri,
                port: 5552,
                username: 'guest',
                password: 'guest',
                vhost: '/',
            };

            this.client = await connect(connectionParams);
            logger.info('Connected to RabbitMQ Stream');
        } catch (error) {
            logger.err('Failed to connect to RabbitMQ Stream: ' + error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.client) {
                await this.client.close();
                this.client = null;
                logger.info('Disconnected from RabbitMQ Stream');
            } else {
                logger.info('No active RabbitMQ Stream connection to disconnect from.');
            }
        } catch (error) {
            logger.err('Error disconnecting from RabbitMQ Stream: ' + error);
            throw error;
        }
    }

    getClient(): any {
        return this.client;
    }
}
