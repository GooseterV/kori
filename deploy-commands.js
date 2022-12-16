const { REST, Routes } = require("discord.js");
const { clientId } = require("./config.json");
const fs = require("node:fs");
const loadEnv = require("dotenv").config;

loadEnv();

// eslint-disable-next-line no-undef
const token = process.env.BOT_TOKEN;
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js")&&!file.endsWith(".ignored.js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


const rest = new REST({ version: "10" }).setToken(token);


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			//Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();