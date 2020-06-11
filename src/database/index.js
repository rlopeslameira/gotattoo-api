import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Client from '../app/models/Client';
import Appointment from '../app/models/Appointment';

import DatabaseConfig from '../config/database';

const models = [User, File, Appointment, Client]

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);

    models.map(model => model.init(this.connection));
    models.map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();