// src/middleware/ErrorHandlerMiddleware.ts
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import logger from "jet-logger";
import {ValidationError} from "@src/errors/ValidationError";
import {RouteError} from "@src/errors/RouteError";

@Service() // This ensures DI works for the middleware
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any) {
        logger.err(JSON.stringify(error));

        if (error instanceof ValidationError) {
            response.status(error.status).json({
                status: 'error',
                message: error.message,
                errors: error.errors,

            });
        } else if (error instanceof RouteError) {
            response.status(error.status).json({
                status: 'error',
                message: error.message,
            });
        } else {
            response.status(500).json({
                status: 'error',
                message: 'Something went wrong',
                details: error.message || null,
            });
        }
    }
}