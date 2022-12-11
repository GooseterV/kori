const loadEnv = require("dotenv").config;
loadEnv();

async function makeQuery(q) {
	const ChatGPTAPI = await (await import("chatgpt")).ChatGPTAPI;
	const api = new ChatGPTAPI({
		// eslint-disable-next-line no-undef
		sessionToken: process.env.SESSION_TOKEN
	});
	await api.ensureAuth();
	const response = await api.sendMessage(
		q
	);
	return response;
}

module.exports = {
	makeQuery
};