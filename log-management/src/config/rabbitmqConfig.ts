import logger from 'jet-logger';
import ENV from '@src/common/ENV';
import { Message } from 'rabbitmq-stream-js-client/dist/publisher';
import { connect, Client, Publisher, DeclareConsumerParams } from 'rabbitmq-stream-js-client';

let client: Client | null = null;

export const connectToRabbitMQ = async () => {
  try {
    if (client) {
      return {connection: client, channel: client};
    }

    const connectionParams = {
      hostname: ENV.RabbitmqUri,
      port: 5552,
      username: 'guest',
      password: 'guest',
      vhost: '/',
    };

    client = await connect(connectionParams);
    logger.info('Connected to RabbitMQ Stream');

    return {connection: client, channel: client};
  } catch (error) {
    logger.err('Failed to connect to RabbitMQ Stream: ' + error);
    throw error;
  }
};

export const disconnectFromRabbitMQ = async () => {
  try {
    if (client) {
      await client.close();
      client = null;
      logger.info('Disconnected from RabbitMQ Stream');
    } else {
    logger.info('No active RabbitMQ Stream connection to disconnect from.');
    }
  } catch (error) {
    logger.err('Error disconnecting from RabbitMQ Stream: ' + error);
    throw error;
  }
};

export const getRabbitMQClient: () => Client = () => {
  if (!client) {
    throw new Error('RabbitMQ Stream client not initialized. Call connectToRabbitMQ first.');
  }

  return client;
};

export async function createConsumer(rabbitmqParam: DeclareConsumerParams, processMessageQueue: { (message: Message): void, (message: Message): Promise<void> | void }){
  client = getRabbitMQClient();
  return await client.declareConsumer(rabbitmqParam, processMessageQueue);
}

export async function createProducer(streamName: string): Promise<Publisher>{
  const client = getRabbitMQClient();
  return await client.declarePublisher({ stream: streamName });
}

export async function createStream(streamName: string, size: number): Promise<boolean> {
  const client = getRabbitMQClient();
  return await client.createStream({
    stream: streamName,
    arguments: {'max-length-bytes': size},
  });
}
