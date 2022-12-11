const crypto = require("crypto");
const api = require("./api.js");
const dotenv = require("dotenv");
dotenv.config();



const latencyMappings = {
	"api": {
		n:0,
		strict:20,
		normal:30,
		immediate: {
			min: 0,
			max: 15
		},
		fast: {
			min: 15,
			max: 35
		},
		medium: {
			min: 36,
			max: 55
		},
		slow: {
			min: 56,
			max: 100
		},
		sluggish: {
			min: 101,
			max: 200
		},
		overloaded: {
			min: 201,
			max: Infinity
		}
		
		
	},
	"bot": {
		n:1,
		strict:300,
		normal:400,
		immediate: {
			min: 0,
			max: 200
		},
		fast: {
			min: 201,
			max: 450
		},
		medium: {
			min: 450,
			max: 700
		},
		slow: {
			min: 701,
			max: 950
		},
		sluggish: {
			min: 951,
			max: 1200
		},
		overloaded: {
			min: 1201,
			max: Infinity
		}

	},
	"canvas": {
		n:2,
		strict:135,
		normal:200,
		immediate: {
			min:0,
			max:100
		},
		fast: {
			min: 101,
			max: 200
		},
		medium: {
			min: 201,
			max: 350
		},
		slow: {
			min: 351,
			max: 500
		},
		sluggish: {
			min: 501,
			max: 1000
		},
		overloaded: {
			min: 1001,
			max: Infinity
		}
	},
};

const latencyColors = {
	"immediate": "#00ff00",
	"fast": "#00ff00",
	"medium": "#d9c22b",
	"slow": "#c76f0a",
	"sluggish": "#c70a0a",
	"overloaded": "#700009"
}; 
const speeds = ["immediate", "fast", "medium", "slow", "sluggish", "overloaded"];
const types = ["api", "bot", "canvas"];
const modes = ["strict", "normal"];

/**
 * Checks the latency for given bot/api processes.
 * @constructor
 * @param {number} latency - The latency to check.
 * @param {string} mode - The mode (strict or normal).
 * @param {string} type - The type (bot, api, canvas).
 */
function latencyCheckers(latency, mode, type) {
	let latencyType = latencyMappings[type];
	let latencySpeeds = Object.entries(latencyType).filter(x=>speeds.includes(x[0]));
	if ("strict" === mode) {
		latencySpeeds.map(x=>{
			x[1].min *= .875;
			x[1].max *= .875;
		});
	}
	let latencySpeed = latencySpeeds.find(x=>(latency <= x[1].max && latency >= x[1].min) ||latency>=x.max) ? latencySpeeds.find(x=>(latency <= x[1].max && latency >= x[1].min) ||latency>=x.max)[0]: "overloaded";
	return {latencySpeed, color:latencyColors[latencySpeed]};
}

// from https://stackapps.com/questions/1009/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
function timeSince(date) {

	let seconds = Math.floor((new Date() - date) / 1000);

	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}

const getRandomBytes = (length) => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(length, (err, buf) => {
			if (err) {
				reject(err);
			} else {
				resolve(buf);
			}
		});
	});
};

function generatePassword(length) {
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


async function getRecipeTags() {
	// eslint-disable-next-line no-undef
	let auth = new api.AuthManager({cookie:null, credentials:false, isCookieBased:false, token:process.env.RAPID_API_KEY});
	let resp = await api.GET("https://tasty.p.rapidapi.com/tags/list", null, {"X-RapidAPI-Key": auth.getToken()});
	return await resp.json();
}

async function getRecipes(from=0, amount=20, tags=[], query="") {
	// eslint-disable-next-line no-undef
	let auth = new api.AuthManager({cookie:null, credentials:false, isCookieBased:false, token:process.env.RAPID_API_KEY});
	let resp = await api.GET("https://tasty.p.rapidapi.com/recipes/list", {from, size:amount, tags, q:query}, {"X-RapidAPI-Host": "tasty.p.rapidapi.com", "X-RapidAPI-Key": auth.getToken()});
	return await resp.json();
}

async function getRecipeInfo(id) {
	// eslint-disable-next-line no-undef
	let auth = new api.AuthManager({cookie:null, credentials:false, isCookieBased:false, token:process.env.RAPID_API_KEY});
	let resp = await api.GET("https://tasty.p.rapidapi.com/recipes/get-more-info", {id}, {"X-RapidAPI-Host": "tasty.p.rapidapi.com", "X-RapidAPI-Key": auth.getToken()});
	return await resp.json();
}


module.exports = {
	latencyCheckers,
	latencyMappings,
	speeds,
	types,
	modes,
	timeSince,
	generatePassword,
	getRandomBytes,
	getRecipeTags,
	getRecipes,
	getRecipeInfo

};