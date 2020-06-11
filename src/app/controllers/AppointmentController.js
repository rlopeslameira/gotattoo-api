import Appointment from '../models/Appointment';
import User from '../models/User';
import Client from '../models/Client';
import File from '../models/File';

import { startOfHour, isBefore, parseISO, subHours, setSeconds, setMinutes, setHours } from 'date-fns';

import * as Yup from 'yup';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { provider_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable', 'details'],
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }]
      }],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      client_id: Yup.number().required(),
      tattoo_id: Yup.number().nullable(true),
      date: Yup.date().required(),
      hour: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' })
    }

    const { client_id, date, hour, tattoo_id, details } = req.body;

    const compareDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);

    if (isBefore(compareDate, new Date())) {
      return res.json({ error: 'Past dates are not permited.' })
    }

    const appointment = await Appointment.create({
      provider_id: req.userId,
      client_id,
      tattoo_id,
      date: date,
      hour: hour,
      details,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'provider',
        attributes: ['name', 'email']
      }, {
        model: Client,
        as: 'client',
        attributes: ['name']
      }]
    });

    if (appointment.provider_id !== req.userId)
      return res.json({ error: 'You don´t have permission to cancel this appointment.' })

    const dateWithSub = subHours(appointment.date, 2);

    appointment.canceled_at = new Date();
    await appointment.save();

    return res.json(appointment);

  }
}

export default new AppointmentController();