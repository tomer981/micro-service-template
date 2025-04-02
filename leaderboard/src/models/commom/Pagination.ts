import {isNumber, isOptionalString} from 'jet-validators';
import {parseObject, TParseOnError, transform} from 'jet-validators/utils';
import {Types} from 'mongoose';


export interface IPaginationParams {
    page: number;
    limit: number;
    except?: string;
}

export interface IScore {
    playerId: Types.ObjectId;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}


export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;


export const parsePaginationSchema = parseObject<IPaginationParams>({
  page: transform(value => Number(value ?? DEFAULT_PAGE), isNumber),
  limit: transform(value => Number(value ?? DEFAULT_LIMIT), isNumber),
  except: isOptionalString,
});

export function testPagination(arg: unknown, errCb?: TParseOnError):
    arg is IPaginationParams {
  return !!parsePaginationSchema(arg, errCb);
}