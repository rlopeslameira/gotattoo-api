"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class File extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize2.default.STRING,
      path: _sequelize2.default.STRING,
      url: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          // return `http://localhost:3333/files/${this.path}`
<<<<<<< HEAD
          return `http://gotattoo.nodejs7003.uni5.net/files/${this.path}`
=======
          return `https://gotattoo.herokuapp.com/files/${this.path}`
>>>>>>> 74926a4e619e8a23b39b229033ea5ea9062b7672
        }
      }
    }, {
      sequelize,
    });

    return this;
  }

}

exports. default = File;