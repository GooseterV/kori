const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require("discord.js");
const dotenv = require("dotenv");
const helpers = require("../helpers/helpers.js");
const config = require("../config.json");

dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("getrecipe")
	.setDescription("Get a recipe by id from the Tasty API.")
	.addIntegerOption(option => option
		.setName("id")
		.setDescription("The id of the recipe to get.")
		.setRequired(true)
	);


async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply({
		ephemeral: true
	});

	const res = await helpers.getRecipeInfo(interaction.options.getInteger("id"));
	console.log(res);
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({
			text: Date.now() - t + "ms",
			iconURL: interaction.user.displayAvatarURL({
				format: "png",
				size: 512
			})
		})
		.setTitle(res.name)
		.setDescription(res.description)
		.setThumbnail(res.thumbnail_url)
		.setTimestamp(Date.now())
		.addFields(
			{name: "Nutrition", value: `
		:fire:${config["whitespace-char"].repeat(2)}**\`${res.nutrition.calories} Calories\`**
		:bread:${config["whitespace-char"].repeat(2)}**\`${res.nutrition.carbohydrates}g Carbs\`**
		:cut_of_meat:${config["whitespace-char"].repeat(2)}**\`${res.nutrition.protein}g Protein\`**
		:falafel:${config["whitespace-char"].repeat(2)}**\`${res.nutrition.fat}g Fat\`**\n\n
		`, inline: true},
			{name: "Ratings", value: `
			${res.user_ratings.score.toFixed(2)*100}%/100% :star:
			${res.user_ratings.count_positive} Positive Reviews :thumbsup:
			${res.user_ratings.count_negative} Negative Reviews :thumbsdown: \n \n
		`, inline:true},
			{ name: "\u200b", value: "\u200b", inline:true},
			{name: "Yields", value: res.num_servings + " Servings", inline: true},
			{name: "Total Time", value: res.total_time_minutes||"~" + " Minutes", inline: true},
		)
		.setURL(res.original_video_url);
	const filter = i => (i.customId==="recipe-information"||i.customId==="ingredients-instructions") && i.user.id === interaction.user.id;
	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		time: 30*1e3
	});
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("recipe-information")
				.setLabel("Info")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("ingredients-instructions")
				.setLabel("Instructions")
				.setStyle(ButtonStyle.Primary),
		);
	collector.on("collect", async i => {
		if (i.customId === "recipe-information") {
			row.components[0].setDisabled(true);
			row.components[1].setDisabled(false);
			row.components[0].setStyle(ButtonStyle.Success);
			row.components[1].setStyle(ButtonStyle.Primary);

			await i.update({
				embeds: [e],
				components: [row],
				ephemeral: false
			});
		} else if (i.customId === "ingredients-instructions") {
			row.components[0].setDisabled(false);
			row.components[1].setDisabled(true);
			row.components[1].setStyle(ButtonStyle.Success);
			row.components[0].setStyle(ButtonStyle.Primary);

			const emb = new EmbedBuilder()
				.setColor(config["color-main"])
				.setFooter({
					text: Date.now() - t + "ms",
					iconURL: interaction.user.displayAvatarURL({
						format: "png",
						size: 512
					})
				})
				.setTitle(res.name)
				.setThumbnail(res.thumbnail_url)
				.setTimestamp(Date.now())
				.setDescription(res.instructions.map(x=>"**"+x.position + [] + ". "+"**" + x.display_text).join("\n\n"))
				.setURL(res.original_video_url);
			
			await i.update({
				embeds: [emb],
				components: [row],
				ephemeral: false
			});
		}
	});

	try {
		await interaction.editReply({
			embeds: [e],
			components: [row],
			ephemeral: false
		});
	} catch (err) {
		await interaction.editReply({
			content: "Uh-Oh! Something went wrong! Please try again later.",
			ephemeral: true
		});
	}
}


module.exports = {
	data: cmd,
	execute,
};