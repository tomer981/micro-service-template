import mongoose from "mongoose";
import { INoSQLClient } from "../core/INoSQLClient";
import { injectable } from "inversify";
import logger from 'jet-logger';
import ENV from "@src/common/ENV";

@injectable()
export class MongoConfig implements INoSQLClient {
    async connect(): Promise<void> {
        try {
            await mongoose.connect(ENV.MongoUri, {
                auth: {
                    username: ENV.MongoInitdbRootUsername,
                    password: ENV.MongoInitdbRootPassword,
                },
                authSource: 'admin',
            });
            logger.info('MongoDB Connected');
        } catch (error) {
            logger.err('MongoDB Connection Error: ' + error);
            throw new Error('MongoDB connection failed.');
        }
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}
