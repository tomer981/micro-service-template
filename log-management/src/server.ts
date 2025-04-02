import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';

import Paths from '@src/common/Paths';
import ENV from '@src/common/ENV';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/route-errors';
import { NodeEnvs } from '@src/common/constants';
import {disconnectFromRabbitMQ} from '@src/config/rabbitmqConfig';
import {disconnectFromMongoDB} from '@src/config/mongoConfig';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use(Paths.Base, BaseRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

const shutdown = async () => {
  try {
    logger.info('Shutting down server...');
    await disconnectFromMongoDB();
    await disconnectFromRabbitMQ();
    logger.info('Server shutdown complete. Exiting gracefully.');
  } catch (error) {
    logger.err('Shutdown error: ' + error);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
