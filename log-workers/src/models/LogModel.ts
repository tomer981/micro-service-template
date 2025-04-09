import { Schema, model, Model, Document, Types } from "mongoose";

export interface ILogDocument extends Document {
    playerId: Types.ObjectId;
    logData: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class LogModelClass {
    private readonly schema: Schema<ILogDocument>;
    private readonly model: Model<ILogDocument>;

    constructor() {
        this.schema = new Schema<ILogDocument>({
            playerId: { type: Schema.Types.ObjectId, required: true },
            logData: { type: String, required: true },
        }, {
            timestamps: true,
        });

        this.model = model<ILogDocument>('log', this.schema);
    }

    public getModel(): Model<ILogDocument> {
        return this.model;
    }
}