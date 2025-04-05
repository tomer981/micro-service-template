import PlayerModel, {DeleteResult, IPlayerDocument} from
  '@src/models/mongo/Player';
import {ICreatePlayer} from '@src/models/common/Player';
import {Types} from 'mongoose';
import logger from "jet-logger";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import {RouteError} from "@src/common/route-errors";


async function getByUsername(username: string): Promise<IPlayerDocument | null> {
  return await PlayerModel.findOne({ username }).exec();
}

async function getByEmail(email: string): Promise<IPlayerDocument | null> {
  return await PlayerModel.findOne({ email }).exec();
}

async function getPlayer(playerId: Types.ObjectId): Promise<IPlayerDocument> {
  const player = await PlayerModel.findById(playerId).exec();

  if (!player) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, `Player with ID ${playerId.toString()} not found`);
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
    logger.info(`Repo: Player not found with ID ${playerId.toString()}`);
    throw new RouteError(HttpStatusCodes.NOT_FOUND, `Player with ID ${playerId.toString()} not found`);
  }

  return updatedPlayer;
}


export default {
  addPlayer,
  getPlayer,
  deletePlayer,
  updatePlayer,
  getByUsername,
  getByEmail,
} as const;
