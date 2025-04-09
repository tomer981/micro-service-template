import {RouteError} from "@src/errors/RouteError";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

export class ValidationError extends RouteError {
    public errors: unknown[];

    constructor(error: Error & { errors?: unknown[] }) {
        const msg = JSON.stringify({
            name: error.name,
            message: error.message,
        });

        super(HttpStatusCodes.BAD_REQUEST, msg);
        this.errors = error.errors || [];
    }
}