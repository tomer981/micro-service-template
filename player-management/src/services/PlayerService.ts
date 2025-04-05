import PlayerRepo from '@src/repos/PlayerRepo';
import {ICreatePlayer} from 'src/models/common/Player';
import {IPlayerDocument} from '@src/models/mongo/Player';
import {Types} from 'mongoose';
import {RouteError} from '@src/common/route-errors';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import logger from 'jet-logger';

async function getPlayer(playerId: Types.ObjectId): Promise<IPlayerDocument> {
  return PlayerRepo.getPlayer(playerId);
}

async function addPlayer(player: ICreatePlayer): Promise<IPlayerDocument> {
  const [existingByUsername, existingByEmail] = await Promise.all([
    PlayerRepo.getByUsername(player.username),
    PlayerRepo.getByEmail(player.email),
  ]);

  if (existingByUsername) {
    logger.info(`Add: Username '${player.username}' already exists`);
    throw new RouteError(HttpStatusCodes.CONFLICT, 'Username already exists');
  }

  if (existingByEmail) {
    logger.info(`Add: Email '${player.email}' already exists`);
    throw new RouteError(HttpStatusCodes.CONFLICT, 'Email already exists');
  }

  return await PlayerRepo.addPlayer(player);
}

async function deletePlayer(playerId: Types.ObjectId) {
  const result = await PlayerRepo.deletePlayer(playerId);

  if (!result.acknowledged || result.deletedCount === 0) {
    logger.info(`Delete: Player not found with ID ${playerId.toString()}`);
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Player not found');
  }

  return {message: 'Player deleted'};
}

async function updatePlayer(player: ICreatePlayer, playerId: Types.ObjectId): Promise<IPlayerDocument> {
  logger.info(`Service: Updating player with ID ${playerId.toString()}`);
  return await PlayerRepo.updatePlayer(player, playerId);
}

export default {
  getPlayer,
  addPlayer,
  deletePlayer,
  updatePlayer,
} as const;
