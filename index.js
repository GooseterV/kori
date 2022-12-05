/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const Logger = require("./helpers/logger.js");
const loadEnv = require("dotenv").config;
loadEnv();

// https://discord.com/api/oauth2/authorize?client_id=1049110989062295652&permissions=8&scope=bot%20applications.commands
const token = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (let file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	
	if ("data" in command && "execute" in command) {
		Logger.info(`Attempting to load command '${command.data.name}'.`);
		client.commands.set(command.data.name, command);
	} else {
		console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.warn(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {

		await command.execute(interaction);
		Logger.info(`Attempted to run command '${interaction.commandName}'.`);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "Uh-Oh! Something went wrong!", ephemeral: true });
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);