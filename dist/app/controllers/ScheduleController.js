"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);
var _Appointment = require('../models/Appointment'); var _Appointment2 = _interopRequireDefault(_Appointment);

var _sequelize = require('sequelize');
var _datefns = require('date-fns');

class ScheduleController {
  async index(req, res){

    const checkUserProvider = await _User2.default.findOne({
      where: {id: req.userId, provider: true}
    });

    if (!checkUserProvider){
      return res.status(401).json({error: 'User is nor a provider.'});
    }
    
    const { date } = req.query;
    const parseDate = _datefns.parseISO.call(void 0, date);
    
    const appointments = await _Appointment2.default.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null, 
        date: {
          [_sequelize.Op.between]: [_datefns.startOfDay.call(void 0, parseDate), _datefns.endOfDay.call(void 0, parseDate)],
        }
      },
      include: [{
        model: _User2.default,
        as: 'user',
        attributes: ['name']
      },
      {
        model: _File2.default,
        as: 'tattoo',
        attributes: ['path', 'url']
      }],
      order: ['date']
    });

    return res.json(appointments);
  }
}

exports. default = new ScheduleController();