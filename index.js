/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;
const { Client, Collection, GatewayIntentBits, Events, version } = require("discord.js");
const loadEnv = require("dotenv").config;
const { logger } = require("./helpers/logging.js");
const {Buffer} = require("node:buffer");
loadEnv();

// https://discord.com/api/oauth2/authorize?client_id=1049110989062295652&permissions=8&scope=bot%20applications.commands
const token = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();


const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")&&!file.endsWith(".ignored.js"));

for (let file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	
	if ("data" in command && "execute" in command) {
		logger.debug(`Loading command ${command.data.name} from ${filePath}`);
		client.commands.set(command.data.name, command);
	} else {
		logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.ClientReady, () => logger.info("Kori is ready!"));
client.on(Events.Debug, m => logger.debug(m));
client.on(Events.Warn, m => logger.warn(m));
client.on(Events.Error, m => logger.error(m));

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.warn(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	let cmds = parseInt(fs.readFileSync("./CMDS.txt", "utf8"));
	cmds += 1;
	fs.writeFileSync("./CMDS.txt", cmds.toString());
	try {
		logger.debug(`Executing command ${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild.name}`);
		await command.execute(interaction);
	} catch (error) {
		logger.error(`Error executing command ${interaction.commandName}`);
		logger.error(error);
		if (interaction.deferred) return interaction.editReply({ content: "Uh-Oh! Something went wrong!", ephemeral: true });
		else await interaction.reply({ content: "Uh-Oh! Something went wrong!", ephemeral: true });
	}
});


/*
client.on(Events.MessageCreate, async message => {
	try {
		const emojis = (await client.guilds.fetch("1046173606524227704")).emojis;
		emojis.cache.forEach(emoji => {
			try {
				message.react(emoji);
			} catch (err) {
				logger.error(err);
			}
		});
	} catch (err) {
		logger.error(err);
	}

});*/

client.once(Events.ClientReady, c => {
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
	];
	let h = choices[Math.floor(Math.random()*choices.length)];
	client.user.setActivity(h);
	setInterval(() => {
		const index = Math.floor(Math.random() * (choices.length) + 1);
		client.user.setActivity(choices[index]);
	}, 1e3*60*5);
	logger.info(`Logged in as ${c.user.tag.normalize("NFC")} | ${c.user.id}.`);
	logger.info(`Node.js ${process.version} | Discord.js v${version}`);
	logger.info(`npm.js ${process.versions.npm} | v8 ${process.versions.v8}`);
	logger.info(`Running on ${process.platform} ${process.arch}`);
	logger.info(`Serving in ${client.guilds.cache.size} servers`);
	logger.info(`Watching ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users`);
	logger.info(`Listening to ${client.guilds.cache.map(x=>x.channels.cache.size).reduce((a, b)=>a+b)} channels`);
	logger.info("Made with <3 by Goose");
	
});

client.login(token);