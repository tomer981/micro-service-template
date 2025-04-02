import PlayerModel, {DeleteResult, IPlayerDocument} from
  '@src/models/mongo/Player';
import {ICreatePlayer} from '@src/models/common/Player';
import {Types} from 'mongoose';

async function getPlayer(playerId: Types.ObjectId): Promise<IPlayerDocument> {
  const player: IPlayerDocument| null = await PlayerModel
    .findOne({_id: playerId})
    .exec();

  if (!player) {
    throw new Error(`Player with ID ${playerId.toString()} not found`);
  }

  return player;
}

async function addPlayer(player: ICreatePlayer): Promise<IPlayerDocument> {
  const newPlayer = new PlayerModel(player);
  return await newPlayer.save();
}

async function deletePlayer(playerId: Types.ObjectId): Promise<DeleteResult> {
  return await PlayerModel.deleteOne(playerId).exec();
}

async function updatePlayer(player: ICreatePlayer,playerId: Types.ObjectId):
    Promise<IPlayerDocument> {
  const updatedPlayer: IPlayerDocument| null =
      await PlayerModel.findOneAndUpdate(
        { _id: playerId },
        player,
        { new: true },
      ).exec();

  if (!updatedPlayer) {
    throw new Error(`Player with ID ${playerId.toString()} not found`);
  }

  return updatedPlayer;
}


export default {
  addPlayer,
  getPlayer,
  deletePlayer,
  updatePlayer,
} as const;
