import User from '../models/User';
import Client from '../models/Client';
import File from '../models/File';
import Appointment from '../models/Appointment';
import { startOfDay, parseISO } from 'date-fns';

class ScheduleController {
  async index(req, res){
    console.log('provider:',  req.userId);

    const checkUserProvider = await User.findOne({
      where: {id: req.userId, provider: true}
    });

    if (!checkUserProvider){
      return res.status(401).json({error: 'User is nor a provider.'});
    }

    const { date } = req.query;
    console.log(date);
    const parseDate = startOfDay(Date.parse(date));    
    console.log(parseDate);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null, 
        date: parseDate,
      },
      include: [{
        model: Client,
        as: 'client',
        attributes: ['name']
      },
      {
        model: File,
        as: 'tattoo',
        attributes: ['path', 'url']
      }],
      order: ['hour']
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();