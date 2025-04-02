import { Router } from 'express';

import Paths from '../common/Paths';
import PlayerRoutes from './LeaderboardRoutes';

const apiRouter = Router();
const PlayerRoute = Router();

PlayerRoute.get(Paths.Leaderboard.Get, PlayerRoutes.getLeaderboard);
apiRouter.use(Paths.Leaderboard.Base, PlayerRoute);

export default apiRouter;
