"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Appointment = require('../models/Appointment'); var _Appointment2 = _interopRequireDefault(_Appointment);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);
var _Notification = require('../schemas/Notification'); var _Notification2 = _interopRequireDefault(_Notification);
var _Mail = require('../../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

var _datefns = require('date-fns');
var _ptBR = require('date-fns/locale/pt-BR'); var _ptBR2 = _interopRequireDefault(_ptBR);

var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await _Appointment2.default.findAll({
      where: { provider_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [{
        model: _User2.default,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: _File2.default,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }]
      }],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      tattoo_id: Yup.number().nullable(true),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' })
    }

    const { user_id, date, tattoo_id } = req.body;

    /**
     * Check for past date
     */

    const hourStart = _datefns.startOfHour.call(void 0, _datefns.parseISO.call(void 0, date));
    if (_datefns.isBefore.call(void 0, hourStart, new Date())) {
      return res.json({ error: 'Past dates are not permited.' })
    }

    /**
     * Check date avaliability
     */
    const checkAvaliability = await _Appointment2.default.findOne({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: hourStart,
      }
    })

    if (checkAvaliability) {
      return res.json({ error: 'Appointment date is not avaliable.' });
    }

    const appointment = await _Appointment2.default.create({
      provider_id: req.userId,
      user_id,
      tattoo_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     */
    // const formatedDate = format(hourStart, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", { locale: ptBr });
    // const user = await User.findByPk(user_id);

    // await Notification.create({
    //   content: `Novo agendamento de ${user.name} ${formatedDate}`,
    //   user: req.userId
    // })

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await _Appointment2.default.findByPk(req.params.id, {
      include: [{
        model: _User2.default,
        as: 'provider',
        attributes: ['name', 'email']
      }, {
        model: _User2.default,
        as: 'user',
        attributes: ['name']
      }]
    });

    if (appointment.provider_id !== req.userId)
      return res.json({ error: 'You don´t have permission to cancel this appointment.' })

    const dateWithSub = _datefns.subHours.call(void 0, appointment.date, 2);

    // if (isBefore(dateWithSub, new Date()))
    //   return res.json({ error: 'Você só pode cancelar agendamentos com 2 horas de antecedência.' })

    appointment.canceled_at = new Date();
    await appointment.save();

    // return res.json(appointment);
    // console.log(appointment);
    // await Mail.sendMail({
    //   to: `${appointment.provider.name} <${appointment.provider.email}>`,
    //   subject: 'Agendamento cancelado',
    //   template: 'cancellation',
    //   context: {
    //     provider: appointment.provider.name,
    //     user: appointment.user.name,
    //     date: format(appointment.date, "'dia ' dd ' de ' MMMM', às ' H:mm'h'", {locale: ptBr})
    //   }
    // });

    return res.json(appointment);

  }
}

exports. default = new AppointmentController();