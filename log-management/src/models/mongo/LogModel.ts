import {Document, model, Schema} from 'mongoose';
import {ILog} from 'src/models/common/Log';

export interface ILogDocument extends ILog, Document {
}

const LogSchema = new Schema<ILogDocument>({
  playerId: {type: Schema.Types.ObjectId, required: true},
  logData: {type: String, required: true},
}, {
  timestamps: true,
});

const LogModel = model<ILogDocument>('log', LogSchema);

export default LogModel;
