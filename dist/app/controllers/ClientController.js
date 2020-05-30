"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class ClientController {
  async store (req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const userExist = await _User2.default.findOne({
      where: { name: req.body.name }
    })

    if (userExist){
      const { id, name } = userExist;
      return res.json({id, name});
    }

    const {id, name} = await _User2.default.create(req.body);

    return res.json({id, name});
  }
}

exports. default = new ClientController();