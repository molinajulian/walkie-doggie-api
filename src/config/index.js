require('dotenv').config();

const config = {
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: process.env.POSTGRES_LOGGING || 'false',
    dialect: 'postgres',
    url: process.env.DATABASE_URL
  },
  migrations: {
    automaticallyUp: process.env.AUTOMATICALLY_UP || false
  },
  server: {
    port: process.env.PORT || 8080,
    momentTimezone: process.env.MOMENT_TIMEZONE || 'America/Buenos_Aires',
    initialPasswordAdmin: process.env.PASSWORD_ADMIN
  },
  logger: {
    minLevel: process.env.LOGGER_MIN_LEVEL || 'debug'
  },
  session: {
    secret: process.env.SECRET
  }
};

module.exports = config;
