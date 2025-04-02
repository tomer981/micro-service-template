import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PlayerService from '@src/services/PlayerService';
import Player from 'src/models/common/Player';

import {IReq, IRes, parseReq} from './common';
import {transIsObjectId} from '@src/util/validators';
import {DeleteResult, IPlayerDocument} from '@src/models/mongo/Player';


const Validators = {
  add: parseReq({player: Player.testCreatePlayer}),
  getId: parseReq({playerId: transIsObjectId}),
} as const;


async function createPlayer(req: IReq, res: IRes) {
  const {player} = Validators.add(req.body);
  const createdPlayer = await PlayerService.addPlayer(player);
  res.status(HttpStatusCodes.CREATED).json(createdPlayer);
}

async function getPlayer(req: IReq, res: IRes) {
  const {playerId} = Validators.getId(req.params);
  const player: IPlayerDocument = await PlayerService.getPlayer(playerId);
  res.status(HttpStatusCodes.OK).json(player);
}

async function deletePlayer(req: IReq, res: IRes) {
  const {playerId} = Validators.getId(req.params);
  const deleteInfo: DeleteResult = await PlayerService.deletePlayer(playerId);
  res.status(HttpStatusCodes.OK)
    .json({message: `${deleteInfo.deletedCount} Player deleted`});
}

async function updatePlayer(req: IReq, res: IRes) {
  const {player} = Validators.add(req.body);
  const {playerId} = Validators.getId(req.params);
  const updatedPlayer = await PlayerService.updatePlayer(player, playerId);
  res.status(HttpStatusCodes.OK).json(updatedPlayer);
}

export default {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} as const;
