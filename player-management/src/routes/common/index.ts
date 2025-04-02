import { Response, Request } from 'express';
import { parseObject, TSchema } from 'jet-validators/utils';
import { ValidationError } from '@src/common/route-errors';


type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

export function parseReq<U extends TSchema>(schema: U) {
  return parseObject(schema, errors => {
    throw new ValidationError(errors);
  });
}
