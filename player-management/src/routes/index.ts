import { Router } from 'express';

import Paths from '../common/Paths';
import PlayerRoutes from './PlayerRoutes';

const apiRouter = Router();

const playerRouter = Router();

playerRouter.get(Paths.Players.Get, PlayerRoutes.getPlayer);
playerRouter.post(Paths.Players.Add, PlayerRoutes.createPlayer);
playerRouter.put(Paths.Players.Update, PlayerRoutes.updatePlayer);
playerRouter.delete(Paths.Players.Delete, PlayerRoutes.deletePlayer);

apiRouter.use(Paths.Players.Base, playerRouter);

export default apiRouter;
