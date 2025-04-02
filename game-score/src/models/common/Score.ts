import {isNumber} from 'jet-validators';
import {parseObject, TParseOnError} from 'jet-validators/utils';

import {transIsObjectId} from '@src/util/validators';
import {Types} from 'mongoose';

export interface IScore {
    playerId: Types.ObjectId;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateScore {
    playerId: Types.ObjectId;
    score: number;
}

const parseCreateScore = parseObject<ICreateScore>({
  playerId: transIsObjectId,
  score: isNumber,
});

function testCreateScore(arg: unknown, errCb?: TParseOnError):
    arg is ICreateScore {
  return !!parseCreateScore(arg, errCb);
}

export default {
  testCreateScore,
} as const;
