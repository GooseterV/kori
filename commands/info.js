const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("node:fs");
const dotenv = require("dotenv");
const { Buffer } = require("buffer");
const cvs = require("../helpers/canvas.js");
const config = require("../config.json");
const helpers = require("../helpers/helpers.js");
const StackBlur = require("stackblur-canvas");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the bots information.");
async function execute(interaction) {
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setTitle("Bot Information")
		.setImage("attachment://background.jpg")
		.setTimestamp(new Date());
	await interaction.deferReply();
	const pre = Date.now();
	const pre2 = Date.now();
	const {canvas, ctx} = await cvs.createCanvasFromImage("./assets/background.jpg");
	const stats = {
		channels:interaction.client.channels,
		guilds:interaction.client.guilds,
		users:interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
		uptime:interaction.client.uptime,
		commands:interaction.client.commands,
		commandsRan:fs.readFileSync("./CMDS.txt", "utf8"),
	};
	StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 8.5);
	ctx.font = "167.5px Ubuntu Bold";
	ctx.fillStyle = config["color-font-light"];
	ctx.textAlign = "center";
	ctx.fillText("Information", canvas.width/2+57, 150);

	ctx.fillStyle = config["color-font-light"];
	ctx.textAlign = "left";
	ctx.font = "75px Ubuntu Bold";
	ctx.fillText("API Latency", 75, 275);
	ctx.fillText("Bot Latency", 75, 350);
	ctx.fillText("Canvas Latency", 75, 425);


	const [apiLatency, botLatency, canvasLatency] = [
		interaction.client.ws.ping, 
		pre2 - interaction.createdTimestamp,
		Date.now() - pre
	];

	const [apiSpeed, botSpeed, canvasSpeed] = [
		helpers.latencyCheckers(apiLatency, "normal", "api"),
		helpers.latencyCheckers(botLatency, "normal", "bot"),
		helpers.latencyCheckers(canvasLatency, "normal", "canvas")
	];

	ctx.fillStyle = config["color-font-dark"];
	ctx.textAlign = "center";
	ctx.fillText(`${Math.abs(apiLatency)}ms`, canvas.width/2+57/2, 275);
	ctx.fillText(`${Math.abs(botLatency)}ms`, canvas.width/2+57/2, 350);
	ctx.fillText(`${Math.abs(canvasLatency)}ms`, canvas.width/2+57/2, 425);

	ctx.textAlign = "right";

	ctx.fillStyle = apiSpeed.color;
	ctx.fillText(apiSpeed.latencySpeed, canvas.width - 75, 275);

	ctx.fillStyle = botSpeed.color;
	ctx.fillText(botSpeed.latencySpeed, canvas.width - 75, 350);

	ctx.fillStyle = canvasSpeed.color;
	ctx.fillText(canvasSpeed.latencySpeed, canvas.width - 75, 425);
	

	ctx.fillStyle = config["color-font-light"];
	ctx.textAlign = "left";
	ctx.font = "75px Ubuntu Bold";
	ctx.fillText("Channels", 75, 625);
	ctx.fillText("Servers", 75, 700);
	ctx.fillText("Users", 75, 775);
	ctx.fillText("Uptime", 75, 850);
	ctx.fillText("Commands", 75, 925);
	ctx.fillText("Commands Ran", 75, 1000);


	ctx.fillStyle = config["color-font-dark"];
	ctx.textAlign = "right";
	ctx.fillText(stats.channels.cache.size, canvas.width - 75, 625);
	ctx.fillText(stats.guilds.cache.size, canvas.width - 75, 700);
	ctx.fillText(stats.users, canvas.width - 75, 775);
	ctx.fillText(helpers.timeSince(new Date(Date.now()-stats.uptime)) + " ago", canvas.width - 75, 850);
	ctx.fillText(stats.commands.size, canvas.width - 75, 925);
	ctx.fillText(stats.commandsRan, canvas.width - 75, 1000);




	const file = new AttachmentBuilder(Buffer.from(canvas.toBuffer()), {name:"background.jpg"});
	try {
		await interaction.editReply({ embeds: [e], files: [file], ephemeral: false });
	} catch (err) {
		await interaction.editReply({ content: "Uh-Oh! Something went wrong! Please try again later.", ephemeral: true });
	}
}


module.exports = {
	data: cmd,
	execute,
};
