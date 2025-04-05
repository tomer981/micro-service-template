import ScoreRepo from '@src/repos/ScoreRepository';
import {ICreateScore} from '@src/models/common/Score';
import {IScoreDocument} from '@src/models/mongo/Score';

async function getTopScores(limit: number): Promise<IScoreDocument[]> {
  return ScoreRepo.getTop(limit);
}


async function addScore(score: ICreateScore): Promise<IScoreDocument> {
  return ScoreRepo.addScore(score);
}


export default {
  getTopScores,
  addScore,
} as const;
