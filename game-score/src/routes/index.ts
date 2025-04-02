import { Router } from 'express';

import Paths from '../common/Paths';
import ScoreRoutes from './ScoreRoutes';

const apiRouter = Router();


const scoreRouter = Router();

scoreRouter.get(Paths.Scores.GetTop, ScoreRoutes.getTop);
scoreRouter.post(Paths.Scores.Add, ScoreRoutes.add);

apiRouter.use(Paths.Scores.Base, scoreRouter);

export default apiRouter;
