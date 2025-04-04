import HttpStatusCodes from '@src/common/HttpStatusCodes';
import LogService from '@src/services/LogService';
import Log from '@src/models/common/Log';
import {IReq, IRes, parseReq} from './common';

const Validators = {
  add: parseReq({log: Log.testLog}),
} as const;

async function add(req: IReq, res: IRes) {
  const {log} = Validators.add(req.body);
  await LogService.addLog(log);
  res.status(HttpStatusCodes.CREATED).end();
}

export default {
  add,
} as const;
