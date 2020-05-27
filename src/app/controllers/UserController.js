import User from '../models/User';
import File from '../models/File';

import * as Yup from 'yup';

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

    const userExist = await User.findOne({
      where: { email: req.body.email }
    })

    if (userExist)
      return res.status(400).json({error: 'User already exist.'});

    const {id, name, email} = await User.create(req.body);

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
    
    const user = await User.findByPk(req.userId);

    // verifica se está alterando o email
    if (email && email !== user.email){
      const userExist = await User.findOne({
        where: { email }
      })
  
      if (userExist)
        return res.status(400).json({error: 'User already exist.'});
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({error: 'Password does not match.'});

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [{
        model: File,
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

export default new UserController();