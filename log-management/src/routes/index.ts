import { Router } from 'express';
import Paths from '../common/Paths';
import LogRoutes from './LogRoutes';

const apiRouter = Router();
const logRouter = Router();

logRouter.post(Paths.Logs.Add, LogRoutes.add);

apiRouter.use(Paths.Logs.Base, logRouter);

export default apiRouter;
