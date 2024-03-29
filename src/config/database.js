// require('dotenv/config');

// Host Heroku Free plan
module.exports = {
  dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  }
}

// module.exports = {
//   dialect: process.env.DB_DIALECT,
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   define: {
//     timestamps: true,
//     underscored: true,
//     underscoredAll: true,
//   }
// }
