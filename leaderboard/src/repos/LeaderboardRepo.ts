import ScoreModel from '@src/models/mongo/Score';
import {IPaginationParams} from '@src/models/commom/Pagination';


interface MetadataItem {
  totalDocuments: number;
}

interface LeaderboardEntry {
  _id: string;
  totalScore: number;
}

interface AggregationResult {
  metadata: MetadataItem[];
  data: LeaderboardEntry[];
}
export interface LeaderboardResult {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  data: LeaderboardEntry[];
}

const getLeaderboard = async (pagination: IPaginationParams):
    Promise<LeaderboardResult> => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;

  const validatedPage = Math.max(1, page);

  const skip = (page - 1) * limit;

  const result = await ScoreModel.aggregate([
    {
      $group: {
        _id: '$playerId',
        totalScore: { $sum: '$score' },
      },
    },
    { $sort: { totalScore: -1 } },
    {
      $facet: {
        metadata: [{ $count: 'totalDocuments' }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]) as [AggregationResult];

  const totalDocuments: number = result[0].metadata.length > 0 ?
    result[0].metadata[0].totalDocuments :
    0;
  const totalPages: number = Math.ceil(totalDocuments / limit);

  return {
    totalDocuments,
    totalPages,
    currentPage: validatedPage,
    data: result[0].data,
  };
};


export default {
  getLeaderboard,
} as const;
