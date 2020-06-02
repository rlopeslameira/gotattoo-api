"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);
var _sharp = require('sharp'); var _sharp2 = _interopRequireDefault(_sharp);
var _path = require('path');
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

class FileController {
  async store(req, res) {
    const { originalname: name, filename } = req.file;

    const path = `small-${filename}`;

    await _sharp2.default.call(void 0, req.file.path)
      .resize(800)
      .jpeg({ quality: 50 })
      .toFile(
        // resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')
        _path.resolve.call(void 0, req.file.destination, path)
      );

    _fs2.default.unlinkSync(req.file.path);

    const dest = await _File2.default.create({ name, path });

    return res.json(dest);
  }
}

exports. default = new FileController();