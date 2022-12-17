const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("santa")
	.setDescription("Finds where Santa is right now!");

async function execute(interaction) {
	await interaction.deferReply();
	// eslint-disable-next-line no-undef
	const res = await (await fetch("https://santa-api.appspot.com/info?client=api=")).json();
	if (res.takeoff > res.now) return interaction.editReply({ content: "Santa hasn't taken off yet!", ephemeral: true });
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setTitle("Santa Tracker")
		.setDescription("Santa is currently at " + res.location + "!");
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
