/* eslint-disable no-undef */
const loadEnv = require("dotenv").config;
loadEnv();

async function makeQuery(q) {
	
	const chatgpt = await import("chatgpt");
	const { ChatGPTAPI, getOpenAIAuth } = chatgpt;
	
	const auth = await getOpenAIAuth({
		email: process.env.OPENAI_EMAIL,
		password: process.env.OPENAI_PASSWORD
	});

	const api = new ChatGPTAPI(...auth);
	await api.ensureAuth();
	const response = await api.sendMessage(
		q
	);
	return response;
}

module.exports = {
	makeQuery
};