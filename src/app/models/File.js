import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}files/${this.path}`
        }
      }
    }, {
      sequelize,
    });

    return this;
  }

}

//return `https://gotattoo.app/api/files/${this.path}`

export default File;
