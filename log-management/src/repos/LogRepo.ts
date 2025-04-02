import {Message} from 'rabbitmq-stream-js-client/dist/publisher';
import logModel from '@src/models/mongo/LogModel';
import {ILog} from '@src/models/common/Log';
import logger from 'jet-logger';

let batchProcessing = false;


export async function processBatchToMongoDB(messageBatch: Message[]): Promise<void> {
  if (batchProcessing || messageBatch.length === 0) return;
  logger.info(`inserting ${messageBatch.length} messages`);
  const logs: ILog[] = messageBatch.map((message: Message) => JSON.parse(message.content.toString()) as ILog);
  const result = await logModel.insertMany(logs);
  logger.info(`inserted ${result.length} messages`);
  batchProcessing = false;
}
