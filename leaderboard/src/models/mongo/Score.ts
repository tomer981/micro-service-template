import * as mongoose from 'mongoose';
import {Document, model, Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import {IScore} from '@src/models/commom/Pagination';


export interface IScoreDocument extends IScore, Document {
}

const scoreSchema = new Schema<IScoreDocument>({
  playerId: {type: Schema.Types.ObjectId, required: true},
  score: {type: Number, required: true},
}, {
  timestamps: true,
});

scoreSchema.plugin(mongoosePaginate);

const ScoreModel = model<IScoreDocument, mongoose.PaginateModel<IScoreDocument>>('score', scoreSchema);

export default ScoreModel;
