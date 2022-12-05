const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the bots information.");
async function execute(interaction) {
	const e = new EmbedBuilder()
		.setColor("#2479e0")
		.setDescription("This bot is a work in progress, and is not yet ready for production use.")
		.setTitle("Bot Information")
		.setThumbnail("https://cdn.discordapp.com/avatars/888888888888888888/88888888888888888888888888888888.png")
		.setTimestamp(new Date());
	await interaction.reply({ embeds: [e] });
}

module.exports = {
	data: cmd,
	execute,
};
