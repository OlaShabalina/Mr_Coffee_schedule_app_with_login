require('dotenv').config();

const pgp = require('pg-promise')();

// db connection details separate for production and dev mode
const connection = {
  connectionString: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
}

const db = pgp(connection);

module.exports = db;