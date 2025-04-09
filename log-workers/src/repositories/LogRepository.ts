import { injectable } from "inversify";
import { ILogRepository } from "../core/ILogRepository";
import {ILogDocument, LogModelClass} from "@src/models/LogModel";
import {LogMessage} from "@src/consumers/LogConsumerWorker";
import logger from "jet-logger";
import {Types} from "mongoose";

@injectable()
export class LogRepository implements ILogRepository {
    private batchProcessing = false;
    private readonly logModel = new LogModelClass().getModel();

    async processBatch(logMessageBatch: LogMessage[]): Promise<void> {
        if (this.batchProcessing || logMessageBatch.length === 0) return;
        this.batchProcessing = true;
        logger.info(`inserting ${logMessageBatch.length} messages`);
        const logs: Partial<ILogDocument>[] = logMessageBatch.map((message: LogMessage) => ({
            playerId: new Types.ObjectId(message.playerId),
            logData: message.logData,
        }));
        const result = await this.logModel.insertMany(logs);
        logger.info(`inserted ${result.length} messages`);
        this.batchProcessing = false;
        return Promise.resolve(undefined);
    }
}