import 'reflect-metadata';
import {App} from "@src/app";
import logger from "jet-logger";

App.start().catch((err: any) => {
    logger.err("Application failed to start:", err);
    process.exit(1);
});