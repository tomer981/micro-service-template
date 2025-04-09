import {LogMessage} from "@src/consumers/LogConsumerWorker";

export interface ILogRepository {
    processBatch(logsBatch: LogMessage[]): Promise<void>;
}