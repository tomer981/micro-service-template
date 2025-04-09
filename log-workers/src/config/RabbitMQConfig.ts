import { injectable } from "inversify";
import { IQueueConfigClient } from "../core/IQueueConfigClient";
import {Client, connect} from "rabbitmq-stream-js-client";
import ENV from "@src/common/ENV";
import logger from "jet-logger";

@injectable()
export class RabbitMQConfig implements IQueueConfigClient {
    client: Client | null = null;

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

    getClient(): unknown {
        return this.client;
    }
}
