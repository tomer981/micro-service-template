import PlayerRepo from '@src/repos/PlayerRepo';
import {ICreatePlayer} from 'src/models/common/Player';
import {DeleteResult, IPlayerDocument} from '@src/models/mongo/Player';
import {Types} from 'mongoose';

async function getPlayer(playerId: Types.ObjectId): Promise<IPlayerDocument> {
  return await PlayerRepo.getPlayer(playerId);
}

async function addPlayer(player: ICreatePlayer): Promise<IPlayerDocument> {
  return await PlayerRepo.addPlayer(player);
}

async function deletePlayer(playerId: Types.ObjectId): Promise<DeleteResult> {
  return await PlayerRepo.deletePlayer(playerId);
}

async function updatePlayer(player: ICreatePlayer,playerId: Types.ObjectId ):
    Promise<IPlayerDocument>{
  return await PlayerRepo.updatePlayer(player, playerId);
}

export default {
  getPlayer,
  addPlayer,
  deletePlayer,
  updatePlayer,
} as const;
