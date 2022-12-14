/* eslint-disable no-irregular-whitespace */
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
	.setName("getrecipes")
	.setDescription("Get recipes from the Tasty API.")
	.addIntegerOption(option => option
		.setName("amount")
		.setDescription("Amount of recipes to list.")
		.setRequired(true)
	)
	.addStringOption(option => option
		.setName("tag")
		.setDescription("Tag to search for.")
		.setRequired(false)
	)
	.addStringOption(option => option
		.setName("query")
		.setDescription("The query to search for.")
		.setRequired(false)
	);


async function execute(interaction) {
	let t = Date.now();
	await interaction.deferReply({
		ephemeral: true
	});
	if (interaction.options.getInteger("amount") > 7) return interaction.editReply({
		content: "The amount of recipes cannot be greater than 7",
		ephemeral: true
	});
	if (interaction.options.getInteger("amount") < 1) return interaction.editReply({
		content: "The amount of recipes cannot be less than 1",
		ephemeral: true
	});

	const tags = (await helpers.getRecipeTags()).results.map(x => x.name);
	if (interaction.options.getString("tag")) {
		if (!tags.includes(interaction.options.getString("tag"))) return interaction.editReply({ content: "The tag you provided is not valid.", ephemeral: true });
	}
	const he = interaction.options.getString("tag") ? [interaction.options.getString("tag")] : [];
	let resp = await helpers.getRecipes(0, interaction.options.getInteger("amount")*4, he||[], interaction.options.getString("query")||"");
	if (resp.message==="Too many requests") return interaction.editReply({ content: "Too many requests. Please try again later.", ephemeral: true });
	if (resp.message==="No recipes found") return interaction.editReply({ content: "No recipes found.", ephemeral: true });
	const getRes = (start=0, stop=interaction.options.getInteger("amount"))=> {
		let res = resp.results.slice(start, stop);
		let h = res.map(x=>x.recipes ? x.recipes[0] : x).map(x=>x.recipes ? x.recipes[0] : x).map(x=>({image:x.thumbnail_url, id:x.id, name:x.name, nutrition:x.nutrition||{}, time:x.total_time_minutes||"~"}));
		let g = h.map(x=>`**${x.name}, ID: ${x.id}**\n      **\`${x.nutrition.calories||"~"} Calories\`**\n      **\`${x.nutrition.carbohydrates||"~"}g Carbs\`\n      **\`${x.nutrition.protein||"~"}g Protein\`\n      **\`${x.time||"~"} Minutes\`**\n`).join("\n");
		return g;
	};
	let g = getRes();
	const filter = i => i.customId.includes("page-") && i.user.id === interaction.user.id;
	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		time: 30*1e3
	});
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("page-1")
				.setLabel("1")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("page-2")
				.setLabel("2")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("page-3")
				.setLabel("3")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("page-4")
				.setLabel("4")
				.setStyle(ButtonStyle.Primary),
		);
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setFooter({
			text: Date.now() - t + "ms",
			iconURL: interaction.user.displayAvatarURL({
				format: "png",
				size: 512
			})
		})
		.setTitle(interaction.user.name || interaction.user.tag + "'s Recipes (Page 1)")
		.setDescription(g)
		.setTimestamp(Date.now());
	collector.on("collect", async i => {
		if (i.customId==="page-1") {
			row.components[0].setStyle(ButtonStyle.Success);
			row.components[0].setDisabled(true);
			row.components[1].setDisabled(false);
			row.components[2].setDisabled(false);
			row.components[3].setDisabled(false);
			row.components[1].setStyle(ButtonStyle.Primary);
			row.components[2].setStyle(ButtonStyle.Primary);
			row.components[3].setStyle(ButtonStyle.Primary);

			e.setTitle(interaction.user.name || interaction.user.tag + "'s Recipes (Page 1)")
				.setDescription(getRes(0, interaction.options.getInteger("amount")));

			await i.update({
				embeds: [e],
				components: [row]
			});
		} else if (i.customId==="page-2") {
			row.components[1].setStyle(ButtonStyle.Success);
			row.components[1].setDisabled(true);
			row.components[0].setDisabled(false);
			row.components[2].setDisabled(false);
			row.components[3].setDisabled(false);
			row.components[0].setStyle(ButtonStyle.Primary);
			row.components[2].setStyle(ButtonStyle.Primary);
			row.components[3].setStyle(ButtonStyle.Primary);

			e.setTitle(interaction.user.name || interaction.user.tag + "'s Recipes (Page 2)")
				.setDescription(getRes(interaction.options.getInteger("amount"), interaction.options.getInteger("amount")*2));
			
			await i.update({
				embeds: [e],
				components: [row]
			});
		} else if (i.customId==="page-3") {
			row.components[2].setStyle(ButtonStyle.Success);
			row.components[2].setDisabled(true);
			row.components[0].setDisabled(false);
			row.components[1].setDisabled(false);
			row.components[3].setDisabled(false);
			row.components[0].setStyle(ButtonStyle.Primary);
			row.components[1].setStyle(ButtonStyle.Primary);
			row.components[3].setStyle(ButtonStyle.Primary);

			e.setTitle(interaction.user.name || interaction.user.tag + "'s Recipes (Page 3)")
				.setDescription(getRes(interaction.options.getInteger("amount")*2, interaction.options.getInteger("amount")*3));

			await i.update({
				embeds: [e],
				components: [row]
			});
		} else if (i.customId==="page-4") {
			row.components[3].setStyle(ButtonStyle.Success);
			row.components[3].setDisabled(true);
			row.components[0].setDisabled(false);
			row.components[1].setDisabled(false);
			row.components[2].setDisabled(false);
			row.components[0].setStyle(ButtonStyle.Primary);
			row.components[1].setStyle(ButtonStyle.Primary);
			row.components[2].setStyle(ButtonStyle.Primary);

			e.setTitle(interaction.user.name || interaction.user.tag + "'s Recipes (Page 4)")
				.setDescription(getRes(interaction.options.getInteger("amount")*3, interaction.options.getInteger("amount")*4));

			await i.update({
				embeds: [e],
				components: [row]
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