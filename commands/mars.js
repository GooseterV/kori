const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
const config = require("../config.json");
//const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
dotenv.config();

const cmd = new SlashCommandBuilder()
	.setName("mars")
	.setDescription("Get a random picture from Mars.");

async function execute(interaction) {
	await interaction.deferReply();
	// eslint-disable-next-line no-undef
	const res = await (await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${~~(Math.random()*2.5e3)}&api_key=`+process.env.NASA_API_KEY)).json();
	const pick = res.photos[~~(Math.random()*res.photos.length)];
	const e = new EmbedBuilder()
		.setColor(config["color-main"])
		.setImage(pick.img_src)
		.setTitle(pick.earth_date + " - " + pick.camera.full_name);
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
