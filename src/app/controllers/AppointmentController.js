import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

import { startOfHour, isBefore, parseISO, format, subHours } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import * as Yup from 'yup';

class AppointmentController {
  async index(req, res){
    const {page = 1} = req.query;
    
    const appointments = await Appointment.findAll({
      where: {provider_id: req.userId, canceled_at: null},
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }]
      }]
    });

    return res.json(appointments);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'})
    }

    const {provider_id, date} = req.body;

    /*
    Check if provider_id is a provider
    */
    const isProvider = await User.findOne({where: {id: provider_id, provider: true}});

    if (!isProvider)
      return res.status(401).json({error: 'You cant only create appointment with providers'});

    /**
     * Check for past date
     */
    
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart,new Date()))
    {
      return res.status(400).json({error: 'Past dates are not permited.'})
    }
    
    /**
     * Check user_id !== provider_id
     */
    if (provider_id === req.userId)
      return res.status(400).json({error: 'It is not possible schedule for yourself.'})


    /**
     * Check date avaliability
     */
    const checkAvaliability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    })

    if (checkAvaliability){
      return res.status(400).json({error: 'Appointment date is not avaliable.'});
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     */
    const formatedDate = format(hourStart, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", {locale: ptBr});
    const user = await User.findByPk(req.userId);

    await Notification.create({
      content: `Novo agendamento de ${user.name} ${formatedDate}`,
      user: provider_id
    })

    return res.json(appointment);
  }

  async delete(req, res){
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'provider',
        attributes: ['name', 'email']
      },{
        model: User,
        as: 'user',
        attributes: ['name']
      }]
    });

    if (appointment.user_id !== req.userId)
      return res.status(400).json({error: 'You don´t have permission to cancel this appointment.'})

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date()))
      return res.status(401).json({error: 'You can olny cancel appointments 2 hours in advance.'})
    
    appointment.canceled_at = new Date();
    await appointment.save();
    
    // return res.json(appointment);
    // console.log(appointment);
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", {locale: ptBr})
      }
    });
   

    return res.json(appointment);
    
  }
}

export default new AppointmentController();