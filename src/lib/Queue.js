import Bee from 'bee-queue';
import LibMail from '../app/jobs/LibMail';

class Queue {
  constructor(){
    this.queue = new Bee('Mail');
  }

  add(data) {
    return this.queue.createJob(data).save() ;
  }

  processQueue(){
    this.queue.process(LibMail.handle);
  }
}

export default new Queue();