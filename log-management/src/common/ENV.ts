import jetEnv, {bool, num, str} from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './constants';
import {transform} from 'jet-validators/utils';

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
  Host: str,
  DisableHelmet: transform((value) => value === 'TRUE', bool),
  JetLoggerMode: str,
  JetLoggerFilepath: str,
  JetLoggerTimestamp: transform((value) => value === 'TRUE', bool),
  JetLoggerFormat: str,
  MongoUri: str,
  RabbitmqUri: str,
  RabbitmqQueueLogs: str,
  MongoInitdbRootUsername: str,
  MongoInitdbRootPassword: str,
});

export default ENV;
