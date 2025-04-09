import { inject, injectable } from "inversify";
import {IStreamQueueService} from "@src/core/IStreamQueueService";
import {TYPES} from "@src/di/types";
import {IQueueConfigClient} from "@src/core/IQueueConfigClient";
import {Client, DeclareConsumerParams, Offset} from "rabbitmq-stream-js-client";
import {Message} from "rabbitmq-stream-js-client/dist/publisher";
import {LogMessage} from "@src/consumers/LogConsumerWorker";
import {ComprehensiveRateLimitPolicy} from "@src/config/ComprehensiveRateLimitPolicy";
import logger from "jet-logger";


@injectable()
export class RabbitmqLogService implements IStreamQueueService {
    constructor(
        @inject(TYPES.IQueueConfigClient) private readonly queueClient: IQueueConfigClient,
    ) {}

    public async consumeQueue(RabbitmqQueueLogs: string, handler: (logMessage: LogMessage) => Promise<void>) {
        const policy = new ComprehensiveRateLimitPolicy(
            { capacity: 100, rate: 50 },
            { rate: 30, capacity: 60 },
            { maxConcurrent: 10 },
            5,
        );

        const consumerParams: DeclareConsumerParams = {
            stream: RabbitmqQueueLogs,
            consumerRef: `consumer-${RabbitmqQueueLogs}`,
            offset: Offset.first(),
            creditPolicy: policy,
            singleActive: true,
        };

        const client = this.queueClient.getClient();
        if (client instanceof Client) {
            await client.declareConsumer(consumerParams, async (msg: Message) => {
                try {
                    const parsed: LogMessage = JSON.parse(msg.content.toString());
                    await handler(parsed);
                } catch (err) {
                    logger.err("Failed to process message: " + err);
                }
            });
        }
    }
}
