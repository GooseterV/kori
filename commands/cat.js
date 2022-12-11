const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("cat")
	.setDescription("Get a random cat image.");

async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply();
	const res = await (await fetch("https://cataas.com/cat?json=true")).json();
	const texts = [
		"Did you ask for a cat?",
		"Here's a cat for you!",
		"I hope you like cats!",
		"Cats!!!!",
		"Cats are the best!",
		"Here's why cats are better than dogs:",
		"Cats are better than dogs.",
		"Kitteh!",
		"Meow!",
		"Purr!",
		"Want a cat?",
		"I kan haz cheezburger?",
	];
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({text:Date.now()-t + "ms", iconURL:interaction.user.displayAvatarURL({format:"png", size:512})})
		.setTitle(texts[~~(Math.random()*texts.length)]) 
		.setImage("https://cataas.com" + res.url)
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
