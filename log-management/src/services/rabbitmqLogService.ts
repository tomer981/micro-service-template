import {createConsumer, createProducer, createStream} 
  from '@src/config/rabbitmqConfig';
import {Offset, Publisher} from 'rabbitmq-stream-js-client';
import { Message } from 'rabbitmq-stream-js-client/dist/publisher';

import ENV from '@src/common/ENV';
import {DeclareConsumerParams} from 'rabbitmq-stream-js-client/dist/client';
import {ComprehensiveRateLimitPolicy} 
  from '@src/config/ComprehensiveRateLimitPolicy';
import {processBatchToMongoDB} from '@src/repos/LogRepo';

const BATCH_INTERVAL_MS = 1000;
const MAX_BATCH_SIZE = 100;

const consumerRef = 'offset-log';
const startFrom: Offset = Offset.first();
const firstOffset: Offset = startFrom.clone();

let publisher: Publisher;
let messageBatch: Message[] = [];

export function getRabbitMQLogPublisher(): Publisher {
  return publisher;
}

function startMongoDBBatchInterval() {
  setInterval(async () => {
    if (messageBatch.length > 0) {
      await processBatchToMongoDB(messageBatch);
      messageBatch = [];
    }
  }, BATCH_INTERVAL_MS);
}

async function processMessageQueue(message: Message) {
  messageBatch.push(message);
  if (messageBatch.length >= MAX_BATCH_SIZE) {
    await processBatchToMongoDB(messageBatch);
  }
}

export async function startWorkerLog() {
  startMongoDBBatchInterval();
  await createStream(ENV.RabbitmqQueueLogs, 5 * 1e9);
  publisher = await createProducer(ENV.RabbitmqQueueLogs);
  const comprehensivePolicy = new ComprehensiveRateLimitPolicy(
    { capacity: 100, rate: 50 },
    { rate: 30, capacity: 60 },
    { maxConcurrent: 10 },
    5,
  );
  const rabbitmqParam: DeclareConsumerParams = {
    stream: ENV.RabbitmqQueueLogs,
    consumerRef: consumerRef,
    offset: firstOffset,
    creditPolicy: comprehensivePolicy,
  };
  await createConsumer(rabbitmqParam, processMessageQueue);
}



