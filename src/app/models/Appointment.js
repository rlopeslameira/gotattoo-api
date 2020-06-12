import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours, parseISO } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATEONLY,
      canceled_at: Sequelize.DATE,
      hour: Sequelize.STRING,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(parseISO(this.date), new Date());
        }
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subHours(parseISO(this.date), 2));
        }
      },
      details: {
        type: Sequelize.TEXT,
      }
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.File, { foreignKey: 'tattoo_id', as: 'tattoo' })
  }

}

export default Appointment;