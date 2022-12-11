const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("fact")
	.setDescription("Get a random fact.");

async function execute(interaction) {
	await interaction.deferReply();
	const res = await (await fetch("https://uselessfacts.jsph.pl/random.json?language=en")).json();
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setDescription(res.text);
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
