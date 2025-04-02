import { Response, Request } from 'express';
import { TSchema } from 'jet-validators/utils';

import { ValidationError } from '@src/common/route-errors';
import {parseOptionalObject} from 'jet-validators/utils/dist/parseObject';

type TRecord = Record<string, unknown>;
export type IReq = Request<TRecord, void, TRecord, TRecord>;
export type IRes = Response<unknown, TRecord>;

/**
 * Throw a "ParseObjError" when "parseObject" fails. Also extract a nested 
 * "ParseObjError" and add it to the nestedErrors array.
 */
export function parseReq<U extends TSchema>(schema: U) {
  return parseOptionalObject(schema, errors => {
    throw new ValidationError(errors);
  });
}
