require('dotenv').config();

const pgp = require('pg-promise')();

const db = pgp({
    connectionString: process.env.DATABASE_URL
});

module.exports = db;