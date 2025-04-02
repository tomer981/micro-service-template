import LeaderboardRepo, {LeaderboardResult} from '@src/repos/LeaderboardRepo';
import {IPaginationParams} from '@src/models/commom/Pagination';

async function getLeaderboard(pagination: IPaginationParams):
    Promise<LeaderboardResult> {
  return await LeaderboardRepo.getLeaderboard(pagination);
}

export default {
  getLeaderboard,
} as const;
