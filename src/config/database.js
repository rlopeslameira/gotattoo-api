require('dotenv/config');

// Host Heroku Free plan
module.exports = {
  dialect: 'mysql',
  host: 'mysql.drconsultoria.uni5.net',
  username: 'drconsultoria',
  password: '1drconsultoria',
  database: 'drconsultoria',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  }
}