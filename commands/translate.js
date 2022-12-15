/* eslint-disable no-undef */

const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
//const {Translate} = require("@google-cloud/translate").v2;
const translate = require("google-translate-api-x");
const dotenv = require("dotenv");
const config = require("../config.json");
const langs = require("../helpers/languages.js");
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("translate")
	.setDescription("Translate text to another language.")
	.addStringOption(option => option
		.setName("text")
		.setDescription("The text to translate.")
		.setRequired(true)
	)
	.addStringOption(option => option
		.setName("target")
		.setDescription("The language to translate to.")
		.setRequired(true)
	)
	.addStringOption(option => option
		.setName("source")
		.setDescription("The language to translate from.")
		.setRequired(false)
	);

	

async function execute(interaction) {
	await interaction.deferReply();
	if (interaction.options.getString("source") === interaction.options.getString("target")) return interaction.editReply({ content: "The source and target languages cannot be the same.", ephemeral: true });
	if (interaction.options.getString("text").length > 500) return interaction.editReply({ content: "The text cannot be longer than 500 characters.", ephemeral: true });
	if (interaction.options.getString("source") && interaction.options.getString("source").length > 5) return interaction.editReply({ content: "The source language and/or target language cannot be longer than 5 characters.", ephemeral: true });
	if (interaction.options.getString("text").includes("```")) return interaction.editReply({ content: "The text cannot contain code blocks.", ephemeral: true });
	if (interaction.options.getString("text").includes("||")) return interaction.editReply({ content: "The text cannot contain spoilers.", ephemeral: true });
	if (interaction.options.getString("text").includes("@")) return interaction.editReply({ content: "The text cannot contain mentions.", ephemeral: true });
	if (interaction.options.getString("text").includes("http")) return interaction.editReply({ content: "The text cannot contain links.", ephemeral: true });
	if (interaction.options.getString("text").includes("discord.gg")) return interaction.editReply({ content: "The text cannot contain invites.", ephemeral: true });
	if (interaction.options.getString("text").includes("discord.com/invite")) return interaction.editReply({ content: "The text cannot contain invites.", ephemeral: true });
	if (interaction.options.getString("text").includes("discordapp.com/invite")) return interaction.editReply({ content: "The text cannot contain invites.", ephemeral: true });
	
	/*
	const translate = new Translate({
		projectId: process.env.GOOGLE_PROJECT_ID,
		credentials: {
			private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
			client_email: process.env.GOOGLE_CLIENT_EMAIL
		}
	});

	const languages = await translate.getLanguages();
	*/
	const languages = langs.codes.map(x=>({code: x}));
	if (!languages.find(l => l.code === interaction.options.getString("target"))) return interaction.editReply({ content: "The target language is not supported. You can find a list of supported languages here:\nhttps://cloud.google.com/translate/docs/languages", ephemeral: true });
	if (interaction.options.getString("source") && !languages.find(l => l.code === interaction.options.getString("source"))) return interaction.editReply({ content: "The source language is not supported. You can find a list of supported languages here:\nhttps://cloud.google.com/translate/docs/languages", ephemeral: true });
	if (interaction.options.getString("source") && interaction.options.getString("source") === "auto") return interaction.editReply({ content: "The source language cannot be auto. It will be auto be default if no language is provided.", ephemeral: true });


	const res = await translate(interaction.options.getString("text"), 
		{to: interaction.options.getString("target"), from: interaction.options.getString("source")||"auto"}
	);

	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setDescription(`
			\`\`\`diff\n--- [${interaction.options.getString("target")}]\n- ${res.text}\n\`\`\`
		`);
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
