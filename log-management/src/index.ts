import logger from 'jet-logger';

import ENV from '@src/common/ENV';
import server from './server';
import {connectToMongoDB} from '@src/config/mongoConfig';
import {connectToRabbitMQ} from '@src/config/rabbitmqConfig';
import {startWorkerLog} from '@src/services/rabbitmqLogService';


const startServer = async () => {
  try {
    await connectToMongoDB();
    await connectToRabbitMQ();
    await startWorkerLog();
    const SERVER_START_MSG = `Express server started on port: ${ENV.Port}`;
    server.listen(ENV.Port, () => logger.info(SERVER_START_MSG));
  } catch (error) {
    logger.err('Failed to start server: ' + error);
  }
};

startServer();
