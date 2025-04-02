import {transform} from 'jet-validators/utils';
import {Types} from 'mongoose';

export const transIsObjectId = transform(
  arg => new Types.ObjectId(arg as string),
  arg => isObjectId(arg),
);

export function isObjectId(id: unknown): id is Types.ObjectId {
  return Types.ObjectId.isValid(id as string);
}
