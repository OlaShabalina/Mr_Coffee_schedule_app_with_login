require('dotenv').config();

const pgp = require('pg-promise')();

const connection = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/schedules_project4`;

const db = pgp(connection);

module.exports = db;