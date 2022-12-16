const pino = require("pino");

const logger = pino({
	name: "Kori",
});

module.exports = {
	logger
};