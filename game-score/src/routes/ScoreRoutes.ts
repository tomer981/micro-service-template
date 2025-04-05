import HttpStatusCodes from '@src/common/HttpStatusCodes';
import ScoreService from '@src/services/ScoreService';
import Score from '@src/models/common/Score';

import { IReq, IRes, parseReq } from './common';
import {IScoreDocument} from '@src/models/mongo/Score';


const Validators = {
  add: parseReq({ score: Score.testCreateScore }),
} as const;


async function add(req: IReq, res: IRes) {
  const { score } = Validators.add(req.body);
  await ScoreService.addScore(score);
  res.status(HttpStatusCodes.CREATED).end();
}

async function getTop(req: IReq, res: IRes) {
  const { limit = 10 } = req.query;
  const topScores: IScoreDocument[] = await ScoreService.getTopScores(Number(limit));
  res.status(HttpStatusCodes.OK).json(topScores);
}


export default {
  getTop,
  add,
} as const;
