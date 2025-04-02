import {ILog} from 'src/models/common/Log';
import {Publisher} from 'rabbitmq-stream-js-client';
import {getRabbitMQLogPublisher} from '@src/services/rabbitmqLogService';
import {Message} from 'rabbitmq-stream-js-client/dist/publisher';

async function addLog(log: ILog): Promise<void> {
  const publisher: Publisher = getRabbitMQLogPublisher();

  if (!publisher) {
    throw new Error('RabbitMQ channel not initialized. Ensure the connection is established.');
  }

  const messages: Message[] = [
    {
      content: Buffer.from(JSON.stringify(log)),
      messageProperties: {
        creationTime: new Date(Date.now()),
      },
      messageHeader: {
        priority: 9,
        durable: true,
      },
    },
  ];

  await publisher.sendSubEntries(messages);
}

export default {
  addLog,
} as const;
