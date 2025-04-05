import {Document, model, Schema} from 'mongoose';
import {IPlayer} from '@src/models/common/Player';

export interface DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}

export interface IPlayerDocument extends IPlayer, Document {}

const playerSchema = new Schema<IPlayerDocument>({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
}, {
  timestamps: true,
});

const PlayerModel = model<IPlayerDocument>('player', playerSchema);

export default PlayerModel;
