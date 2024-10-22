import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { upload } from './middlewares/upload';

const fileRouter = Router();

fileRouter.post('/', upload.single('file'), fileController.create);

export default fileRouter;
