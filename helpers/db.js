/* eslint-disable no-undef */
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();


const credentials = {
	url: process.env.HEROKU_POSTGRES_URL,
	port: process.env.HEROKU_POSTGRES_PORT,
	host: process.env.HEROKU_POSTGRES_HOST,
	db: process.env.HEROKU_POSTGRES_DB,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
};

const sequelize = (url) => new Sequelize(url);


module.exports = {
	sequelize,
	credentials,
};
