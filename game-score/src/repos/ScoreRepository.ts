import {ICreateScore} from '@src/models/common/Score';
import ScoreModel, {IScoreDocument} from '@src/models/mongo/Score';
import logger from 'jet-logger';
import {RouteError} from '@src/common/route-errors';
import HttpStatusCodes from '@src/common/HttpStatusCodes';


async function getTop(limit: number): Promise<IScoreDocument[]> {
  try {
    return await ScoreModel
      .find()
      .sort({score: -1})
      .limit(limit)
      .exec();
  } catch (error) {
    logger.err('Error fetching top scores: ' + error);
    throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching top scores');  }
}

async function addScore(score: ICreateScore): Promise<IScoreDocument> {
  try {
    const newScore = new ScoreModel(score);
    return await newScore.save();
  } catch (error) {
    logger.err('Error saving score: ' + error);
    throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Error saving score');
  }
}

export default {
  getTop,
  addScore,
} as const;
