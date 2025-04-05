import {Document, model, Schema} from 'mongoose';
import {IScore} from '@src/models/common/Score';

export interface IScoreDocument extends IScore, Document {}

const scoreSchema = new Schema<IScoreDocument>({
  playerId: {type: Schema.Types.ObjectId, required: true, index: true},
  score: {type: Number, required: true},
}, {
  timestamps: true,
});

const ScoreModel = model<IScoreDocument>('score', scoreSchema);

export default ScoreModel;
