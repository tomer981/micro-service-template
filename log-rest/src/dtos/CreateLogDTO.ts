// src/dtos/CreateLogDTO.ts
import {IsEnum, IsNotEmpty, IsOptional, IsString, Length} from 'class-validator';
import { Transform } from 'class-transformer';
import {LogLevel} from "@src/common/LogLevel";


export class CreateLogDTO {
    @IsString()
    @Length(24)
    playerId!: string;

    @IsString()
    logData!: string;

    @IsOptional()
    @IsEnum(LogLevel)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const normalized = value.toLowerCase();
            return Object.values(LogLevel).includes(normalized as LogLevel)
                ? normalized
                : LogLevel.INFO;
        }
        return LogLevel.INFO;
    })
    logLevel: LogLevel = LogLevel.INFO;
}
