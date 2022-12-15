const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("avatar")
	.setDescription("Get a users avatar.")
	.addUserOption(option => option
		.setName("user")
		.setDescription("The user to get the avatar of.")
		.setRequired(false)
	);
cmd.aliases = ["av", "pfp", "icon"];
	

async function execute(interaction) {
	await interaction.deferReply();
	let u = interaction.options.getUser("user") || interaction.user;
	const e = new EmbedBuilder()
		.setColor(u.displayColor||config["color-main"])
		.setImage(u.displayAvatarURL({format:"png", size:512}))
		.setTitle(u.tag);
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
