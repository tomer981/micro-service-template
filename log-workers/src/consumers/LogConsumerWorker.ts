import { inject, injectable } from "inversify";
import {IWorker} from "src/core/IWorker";
import {TYPES} from "@src/di/types";
import {ILogRepository} from "@src/core/ILogRepository";
import {IStreamQueueService} from "@src/core/IStreamQueueService";
import ENV from "@src/common/ENV";

const BATCH_INTERVAL_MS = 1000;
const MAX_BATCH_SIZE = 100;


export interface LogMessage {
    playerId: string;
    logData: string;
}

@injectable()
export class LogConsumerWorker implements IWorker {
    logMessageBatch: LogMessage[] = [];

    constructor(
        @inject(TYPES.ILogRepository) private readonly logRepository: ILogRepository,
        @inject(TYPES.IStreamQueueService) private readonly streamService: IStreamQueueService,
    ) {}

    private readonly handleMessage = async (logMessage: LogMessage): Promise<void> => {
        this.logMessageBatch.push(logMessage);
        if (this.logMessageBatch.length >= MAX_BATCH_SIZE) {
            await this.logRepository.processBatch(this.logMessageBatch);
            this.logMessageBatch = [];
        }
    };

    private setInsertLogsToNoSQInterval() {
        setInterval(async () => {
            if (this.logMessageBatch.length > 0) {
                await this.logRepository.processBatch(this.logMessageBatch);
                this.logMessageBatch = [];
            }
        }, BATCH_INTERVAL_MS);
    }

    async run(): Promise<void> {
        this.setInsertLogsToNoSQInterval();
        await this.streamService.consumeQueue(
            ENV.RabbitmqQueueLogs,
            this.handleMessage
        );
    }
}
