import 'module-alias/register';
import logger from 'jet-logger';
import ENV from '@src/common/ENV';
import server from './server';
import {connectToMongoDB} from '@src/config/mongoConfig';


const startServer = async () => {
  try {
    await connectToMongoDB();
    const SERVER_START_MSG = `Express server started on port: ${ENV.Port}`;
    server.listen(ENV.Port, () => logger.info(SERVER_START_MSG));
  } catch (error) {
    logger.err('Failed to start server: ' + error);
  }
};

startServer();
