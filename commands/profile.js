const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const dotenv = require("dotenv");
const { Buffer} = require("buffer");
const cvs = require("../helpers/canvas.js");
const config = require("../config.json");
const StackBlur = require("stackblur-canvas");
const sharp = require("sharp");
const {loadImage} = require("canvas");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("Get a users profile.")
	.addUserOption(option => option.setName("user").setDescription("The user to get the profile of.").setRequired(false));

async function execute(interaction) {
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setDescription("This bot is a work in progress, and is not yet ready for production use.")
		.setTitle("Bot Information")
		.setImage("attachment://profile.jpg")
		.setTimestamp(new Date());
	await interaction.deferReply();
	const h = await sharp(Buffer.from(await (await fetch(await await (await cvs.createCanvasFromImage("./assets/background.jpg", [0, 0],)).canvas.toDataURL("image/png"))).arrayBuffer())).toFormat("png").resize(475, 150).toBuffer();
	const {canvas, ctx} = await cvs.createCanvasFromImage("data:image/png;base64,"+h.toString("base64url"));

	
	StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 0);

	ctx.font = "35px Ubuntu Bold";
	ctx.fillStyle = config["color-font-dark"];
	ctx.textAlign = "right";
	ctx.fillText(interaction.user.tag, canvas.width-canvas.width/4.75, 50);
	
	let img = await loadImage(await sharp(Buffer.from(await (await fetch(await interaction.user.displayAvatarURL({format: "svg", size: 1024}))).arrayBuffer())).toFormat("png").resize(100, 100).toBuffer());
	ctx.drawImage(img, 25, 25);
	
	const file = new AttachmentBuilder(Buffer.from(canvas.toBuffer()), "profile.jpg");
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
