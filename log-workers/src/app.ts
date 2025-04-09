import {TYPES} from "@src/di/types";
import {InversifyConfig} from "src/di/inversify";
import {IWorker} from "src/core/IWorker";

export class App {
    static async start(): Promise<void> {
        InversifyConfig.configureContainer();
        await InversifyConfig.connectToServices();

        const worker = InversifyConfig.container.get<IWorker>(TYPES.IWorker);
        await worker.run();
    }
}