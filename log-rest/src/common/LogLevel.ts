export enum LogLevel {
    INFO = 'info',
    ERROR = 'error',
    WARN = 'warn',
    DEBUG = 'debug'
}

export const LogLevelSeverity: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 2,
    [LogLevel.INFO]: 4,
    [LogLevel.WARN]: 6,
    [LogLevel.ERROR]: 8,
};