// src/controllers/LogMessageController.ts
import {Body, Get, JsonController, Post} from "routing-controllers";
import {CreateLogDTO} from "@src/dtos/CreateLogDTO";
import {Inject, Service} from "typedi";
import {ILogMessageService} from "@src/interfaces/ILogMessageService";
import {TOKENS} from "@src/common/InjectionTokens";
import logger from "jet-logger";

@Service()
@JsonController('/log')
export class LogMessageController {
    constructor(
        @Inject(TOKENS.LogMessageService) private readonly logMessageService: ILogMessageService
    ) {}

    @Post('/')
    async addLog(@Body({required: true}) createLogDTO: CreateLogDTO) {
        await this.logMessageService.pushMessageToTheQueue(createLogDTO.playerId, createLogDTO.logData, createLogDTO.logLevel);
        return { status: 'success' };
    }

    @Get('/')
    print(){
        logger.info("Getting log messages");
        return { message: "Log printed successfully" };
    }
}