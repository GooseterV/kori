const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const ai = require("../helpers/ai.js");
const config = require("../config.json");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("chat")
	.setDescription("Chat with chatgpt.")
	.addStringOption(option => option
		.setName("query")
		.setDescription("The query to ask ChatGPT-3.")
		.setRequired(true)
	);

async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply();
	const res = await ai.makeQuery(interaction.options.getString("query"));
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({text:Date.now()-t + "ms", iconURL:interaction.user.displayAvatarURL({format:"png", size:512})})
		.setTitle(interaction.user.tag)
		.setDescription(res)
		.setImage("attachment://profile.png")
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
