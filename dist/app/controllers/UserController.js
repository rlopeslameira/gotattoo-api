"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);

var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class UserController {
  async store (req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(3),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const userExist = await _User2.default.findOne({
      where: { email: req.body.email }
    })

    if (userExist)
      return res.status(400).json({error: 'User already exist.'});

    const {id, name, email} = await _User2.default.create(req.body);

    return res.json({id, name, email});
  }

  async update(req, res){
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(3),
      password: Yup.string()
        .min(3)
        .when('oldPassword', (oldPassword, _password) => 
          oldPassword ? _password.required() : _password
        ),
      confirmPassword: Yup.string().when('password', (password, _confirmPassword) => 
        password ? _confirmPassword.required().oneOf([Yup.ref('password')]) : _confirmPassword
      )
    });
    
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const { email, oldPassword } = req.body;
    
    const user = await _User2.default.findByPk(req.userId);

    // verifica se está alterando o email
    if (email && email !== user.email){
      const userExist = await _User2.default.findOne({
        where: { email }
      })
  
      if (userExist)
        return res.status(400).json({error: 'User already exist.'});
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({error: 'Password does not match.'});

    await user.update(req.body);

    const { id, name, avatar } = await _User2.default.findByPk(req.userId, {
      include: [{
        model: _File2.default,
        as: 'avatar',
        attributes: ['id', 'path', 'url']
      }]
    })

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

exports. default = new UserController();