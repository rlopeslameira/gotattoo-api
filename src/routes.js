import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import AvaliableController from './app/controllers/AvaliableController';
import ClientController from './app/controllers/ClientController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/clients', ClientController.store);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/avaliable', AvaliableController.index);

routes.post('/files', upload.single('file'), FileController.store);
// routes.post('/files', upload.single('file'), FileController.store);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);

export default routes;