import {LogMessage} from "@src/consumers/LogConsumerWorker";

export interface IStreamQueueService {
    consumeQueue(RabbitmqQueueLogs: string, processBatch: (msg: LogMessage) => Promise<void>): any;
}
