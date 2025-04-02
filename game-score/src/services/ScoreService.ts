import ScoreRepo from '@src/repos/ScoreRepository';
import {ICreateScore} from '@src/models/common/Score';
import {IScoreDocument} from '@src/models/mongo/Score';
import logger from 'jet-logger';

async function getTopScores(limit: number): Promise<IScoreDocument[]> {
  return await ScoreRepo.GetTop(10);  // Use repository to fetch top scores
}

async function addScore(score: ICreateScore): Promise<IScoreDocument> {
  try {
    return await ScoreRepo.add(score);
  } catch (error) {
    logger.err('Error in service when adding score:' + error);
    throw new Error('Error adding score');
  }
}


export default {
  getTopScores,
  addScore,
} as const;
