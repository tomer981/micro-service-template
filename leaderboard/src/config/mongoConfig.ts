import mongoose from 'mongoose';
import ENV from '@src/common/ENV';
import logger from 'jet-logger';

const MONGO_URI = ENV.MongoUri;
const MONGO_USER = ENV.MongoInitdbRootUsername;
const MONGO_PASSWORD = ENV.MongoInitdbRootPassword;


const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      auth: {
        username: MONGO_USER,
        password: MONGO_PASSWORD,
      },
      authSource: 'admin',
    });
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.err('MongoDB Connection Error: ' + error);
    throw new Error('MongoDB connection failed.');
  }
};


const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.err('MongoDB Disconnection Error: ' + error);
  }
};

export {connectToMongoDB, disconnectFromMongoDB};
