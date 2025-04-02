import { isString } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';
import {Types} from 'mongoose';
import {transIsObjectId} from '@src/util/validators';

export interface ILog {
  playerId: Types.ObjectId;
  logData: string;
}

const parseUser = parseObject<ILog>({
  playerId: transIsObjectId,
  logData: isString,
});

function testLog(arg: unknown, errCb?: TParseOnError): arg is ILog {
  return !!parseUser(arg, errCb);
}

export default {
  testLog,
} as const;