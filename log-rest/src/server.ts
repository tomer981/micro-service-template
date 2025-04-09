// src/server.ts
import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import ENV from "@src/common/ENV";
import logger from "jet-logger";

export class Server {
    public static setup(app: Application): void {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        if (ENV.NodeEnv === 'development') {
            app.use(morgan('dev'));
        }

        if (ENV.NodeEnv === 'production') {
            app.use(helmet());
        }
    }

    public static startServer(app: Application): void {
        app.listen(ENV.Port, () => {
            logger.info(`Server is running on port ${ENV.Port}`);
        });
    }
}
