const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const helpers = require("../helpers/helpers.js");
const config = require("../config.json");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("generatepassword")
	.setDescription("Generate a secure password")
	.addIntegerOption(option => option
		.setName("length")
		.setDescription("The byte length of the password.")
		.setRequired(true)
	);

async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply({ ephemeral: true });
	if (interaction.options.getInteger("length") > 256) return interaction.editReply({ content: "The length of the password cannot be greater than 256 bytes", ephemeral: true });
	const res = helpers.generatePassword(interaction.options.getInteger("length"));
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({text:Date.now()-t + "ms", iconURL:interaction.user.displayAvatarURL({format:"png", size:512})})
		.setTitle(interaction.user.tag)
		.setDescription("``` " + res + " ```")
		.setTimestamp(Date.now());
	try {
		await interaction.editReply({ embeds: [e], ephemeral: true});
	} catch (err) {
		await interaction.editReply({ content: "Uh-Oh! Something went wrong! Please try again later.", ephemeral: true });
	}
}


module.exports = {
	data: cmd,
	execute,
};
