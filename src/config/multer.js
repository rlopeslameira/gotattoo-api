import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    destination: '/root/gotattoo-api/tmp/uploads/',
    onError : function(err, next) {
      console.log('error', err);
      next(err);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(10, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      })
    }
  })
}

