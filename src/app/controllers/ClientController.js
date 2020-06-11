import Client from '../models/Client';

import * as Yup from 'yup';

class ClientController {
  async store (req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const clientExist = await Client.findOne({
      where: { name: req.body.name }
    })

    if (clientExist){
      const { id, name } = clientExist;
      return res.json({id, name});
    }

    const {id, name} = await Client.create(req.body);

    return res.json({id, name});
  }
}

export default new ClientController();