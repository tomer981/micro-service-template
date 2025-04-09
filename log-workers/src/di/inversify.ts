import {Container} from "inversify";
import {INoSQLClient} from "@src/core/INoSQLClient";
import {TYPES} from "@src/di/types";
import {MongoConfig} from "@src/config/MongoConfig";
import {RabbitMQConfig} from "@src/config/RabbitMQConfig";
import {IQueueConfigClient} from "@src/core/IQueueConfigClient";
import {IWorker} from "src/core/IWorker";
import {LogConsumerWorker} from "@src/consumers/LogConsumerWorker";
import {ILogRepository} from "src/core/ILogRepository";
import {LogRepository} from "@src/repositories/LogRepository";
import {IStreamQueueService} from "@src/core/IStreamQueueService";
import {RabbitmqLogService} from "@src/services/RabbitmqLogService";


export class InversifyConfig {
    public static readonly container = new Container({
        defaultScope: 'Singleton',
    });

    public static configureContainer(): void {
        InversifyConfig.container.bind<INoSQLClient>(TYPES.INoSQLClient).to(MongoConfig);
        InversifyConfig.container.bind<IQueueConfigClient>(TYPES.IQueueConfigClient).to(RabbitMQConfig);
        InversifyConfig.container.bind<IStreamQueueService>(TYPES.IStreamQueueService).to(RabbitmqLogService);
        InversifyConfig.container.bind<IWorker>(TYPES.IWorker).to(LogConsumerWorker);
        InversifyConfig.container.bind<ILogRepository>(TYPES.ILogRepository).to(LogRepository);
    }

    public static async connectToServices() {
        const dbClient = this.container.get<INoSQLClient>(TYPES.INoSQLClient);
        const queueClient = this.container.get<IQueueConfigClient>(TYPES.IQueueConfigClient);

        await dbClient.connect();
        await queueClient.connect();
    }
}