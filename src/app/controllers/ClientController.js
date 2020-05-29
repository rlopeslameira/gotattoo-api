import User from '../models/User';

import * as Yup from 'yup';

class ClientController {
  async store (req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const userExist = await User.findOne({
      where: { name: req.body.name }
    })

    if (userExist){
      const { id, name } = userExist;
      return res.json({id, name});
    }

    const {id, name} = await User.create(req.body);

    return res.json({id, name});
  }
}

export default new ClientController();