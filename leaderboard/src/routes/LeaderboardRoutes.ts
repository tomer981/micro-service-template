import HttpStatusCodes from '@src/common/HttpStatusCodes';
import LeaderboardService from '@src/services/LeaderboardService';

import {IReq, IRes} from './common';
import {IPaginationParams, parsePaginationSchema} from
  '@src/models/commom/Pagination';


const Validators = {
  leaderboard: parsePaginationSchema,
} as const;

async function getLeaderboard(req: IReq, res: IRes) {
  const pagination: IPaginationParams = Validators.leaderboard(req.query);
  const leaderboards = await LeaderboardService.getLeaderboard(pagination);
  res.status(HttpStatusCodes.OK).json(leaderboards);
}

export default {
  getLeaderboard,
} as const;
