import { Router } from 'express';
import multer from 'multer';
import sharp from "sharp";
import fs from 'fs';
import { extname, resolve } from 'path';
import File from './app/models/File';

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

routes.get('/', (req, res) => {
  res.send('Server UP');
});
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/clients', ClientController.store);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/avaliable', AvaliableController.index);

const uploadFile = upload.single('file');

routes.post('/files', uploadFile , (req, res) => {
  uploadFile( req, res, async ( err ) => {
    if ( err ) 
      return console.log( err );

    const { originalname: name, filename } = req.file;

    const path = `small-${filename}`;

    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 50 })
      .toFile(
        // resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')
        resolve(req.file.destination, path)
      );

    fs.unlinkSync(req.file.path);

    const dest = await File.create({ name, path });

    return res.json(dest);
  });
});
// routes.post('/files', upload.single('file'), FileController.store);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);

export default routes;