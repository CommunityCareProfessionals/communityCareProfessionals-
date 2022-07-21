const Sequelize = require('sequelize');
require('dotenv').config();

var sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
      query: {
        raw: false,
      },
      logging: true,
      // dialectOptions: {
      //   // useUTC: false, //for reading from database
      //   dateStrings: true,
      //   typeCast: true,
      // },
      timezone: '-05:00', //for writing to database
    }
  );
}

module.exports = sequelize;
