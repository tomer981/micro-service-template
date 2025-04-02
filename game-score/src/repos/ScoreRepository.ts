import {ICreateScore} from '@src/models/common/Score';
import ScoreModel, {IScoreDocument} from '@src/models/mongo/Score';
import logger from 'jet-logger';


async function GetTop(limit: number): Promise<IScoreDocument[]> {
  try {
    return await ScoreModel
      .find()
      .sort({score: -1})
      .limit(limit)
      .exec();
  } catch (error) {
    logger.err('Error fetching top scores:' + error);
    throw new Error('Error fetching top scores');
  }
}

async function add(score: ICreateScore): Promise<IScoreDocument> {
  const newScore = new ScoreModel(score);
  return await newScore.save();
}

export default {
  GetTop,
  add,
} as const;
