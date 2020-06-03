import File from '../models/File';
// import sharp from "sharp";
import { resolve } from 'path';
import fs from 'fs';

class FileController {
  async store(req, res) {
    const { originalname: name, filename } = req.file;

    const path = `small-${filename}`;

    // await sharp(req.file.path)
    //   .resize(800)
    //   .jpeg({ quality: 50 })
    //   .toFile(
    //     // resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')
    //     resolve(req.file.destination, path)
    //   );

    // fs.unlinkSync(req.file.path);

    const dest = await File.create({ name, path });

    return res.json(dest);
  }
}

export default new FileController();