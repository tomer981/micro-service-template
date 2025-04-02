import {isEmail, isString} from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';

export interface IPlayer {
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePlayer {
  username: string;
  email: string;
}

const parseCreatePlayer = parseObject<ICreatePlayer>({
  username: isString,
  email: isEmail,
});

function testCreatePlayer(arg: unknown, errCb?: TParseOnError):
    arg is ICreatePlayer {
  return !!parseCreatePlayer(arg, errCb);
}

export default {
  testCreatePlayer,
} as const;