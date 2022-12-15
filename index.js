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
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")&&!file.endsWith(".ignored.js"));

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
	let cmds = parseInt(fs.readFileSync("./CMDS.txt", "utf8"));
	cmds += 1;
	fs.writeFileSync("./CMDS.txt", cmds.toString());
	try {
		
		await command.execute(interaction);
		Logger.info(`Attempted to run command '${interaction.commandName}' from '${interaction.user.tag}'.`);
	} catch (error) {
		Logger.error(error);
		console.log(error);
		if (interaction.deferred) return interaction.editReply({ content: "Uh-Oh! Something went wrong!", ephemeral: true });
		else await interaction.reply({ content: "Uh-Oh! Something went wrong!", ephemeral: true });
	}
});

const choices = [
	"in " + client.guilds.cache.size + " servers",
	"with " + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + " users",
	"with " + client.commands.size + " commands",
	"in " + client.channels.cache.size + " channels",
	"with your mom",
	"Made by @Goose#4825",
	"Created for the Snowcode 2022 Hackathon",
	"with other multi-purpose bots",
	"with other bots",
	"on discord",
	"Made with <3 by Goose",
	"Discord.js v14, Node.js v16, and JavaScript",
	"DJS v14, Node.js v16, and JS",
	"Deployed with Heroku && GitHub",
	"The best bot.",
	"Not the best bot.",
	"It's okay, I'm here now.",
	"Serving " + client.guilds.cache.size + " servers",
	"Watching " + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + " users",
	"Playing with " + client.commands.size + " commands",
	"Listening to " + client.channels.cache.size + " channels",
	"<3",
	"Kori - Ice, Icicle",
	"Fuyu - Winter",
	"Yuki - Snow",
	"Ice, Icicle - Kori",
	"Winter - Fuyu",
	"Snow - Yuki",
	"Christmas - Kurisumasu",
	"Kurisumasu - Christmas",
];



client.once(Events.ClientReady, c => {
	client.user.setActivity(choices[Math.floor(Math.random()*choices.length)], { type: "COMPETING" });
	setInterval(() => {
		const index = Math.floor(Math.random() * (choices.length) + 1);
		client.user.setActivity(choices[index], { type: "COMPETING" });
	}, 1e3*60*5);
	client.user.setStatus("idle");
	console.log(`Ready! Logged in as ${c.user.tag}`);
	
});

client.login(token);