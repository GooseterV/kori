const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dotenv = require("dotenv");
const cvs = require("../helpers/canvas.js");
const config = require("../config.json");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the bots information.");
async function execute(interaction) {
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setDescription("This bot is a work in progress, and is not yet ready for production use.")
		.setTitle("Bot Information")
		.setImage("attachment://background.jpg")
		.setTimestamp(new Date());
	const pre = Date.now();
	const canvas = cvs.createCanvasFromImage("./assets/background.jpg");
	const [apiLatency, botLatency, canvasLatency] = [
		interaction.client.ws.ping, 
		Date.now() - interaction.createdTimestamp,
		Date.now() - pre
	];
	console.log(apiLatency, botLatency, canvasLatency)
	await interaction.reply({ embeds: [e], files: ["./assets/background.jpg"] });
}

module.exports = {
	data: cmd,
	execute,
};
