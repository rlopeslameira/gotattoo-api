"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _beequeue = require('bee-queue'); var _beequeue2 = _interopRequireDefault(_beequeue);
var _LibMail = require('../app/jobs/LibMail'); var _LibMail2 = _interopRequireDefault(_LibMail);

class Queue {
  constructor(){
    this.queue = new (0, _beequeue2.default)('Mail');
  }

  add(data) {
    return this.queue.createJob(data).save() ;
  }

  processQueue(){
    this.queue.process(_LibMail2.default.handle);
  }
}

exports. default = new Queue();