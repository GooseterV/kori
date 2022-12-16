const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
//const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("dog")
	.setDescription("Get a random dog image.");

async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply();
	const res = await (await fetch("https://dog.ceo/api/breeds/image/random")).json();
	const texts = [
		"Did you ask for a dog?",
		"Here's a dog for you!",
		"I hope you like dogs!",
		"Want a dog?",
		"Woof woof!",
		"Bark. Barkbark, bark bark bark barkbarkbark.",
		"Grrrrrrr",
		"Doggo!",
		"Doggeh!",
		"PUPPYYYYYYYYYYY",
		"what a cute one!!",
		"I love dogs!",
	];
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({text:Date.now()-t + "ms", iconURL:interaction.user.displayAvatarURL({format:"png", size:512})})
		.setTitle(texts[~~(Math.random()*texts.length)]) 
		.setImage(res.message)
		.setTimestamp(Date.now());
	try {
		await interaction.editReply({ embeds: [e], ephemeral: false });
	} catch (err) {
		await interaction.editReply({ content: "Uh-Oh! Something went wrong! Please try again later.", ephemeral: true });
	}
}


module.exports = {
	data: cmd,
	execute,
};
