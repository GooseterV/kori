//const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
const helpers = require("./helpers.js");
class AuthManager {
	constructor(options = {"token":null, "cookie":null, "credentials":false, "username":null, "password":null, "isCookieBased":false}) {
		if (options.credentials) {
			this.token = null;
			this.username = options.username;
			this.password = options.password;
		} else if (!options.credentials) {
			this.token = options.token;
			this.username = null;
			this.password = null;
		} else if (options.isCookieBased) {
			this.token = null;
			this.username = null;
			this.password = null;
			this.credentials = "include";
		} else {
			throw new Error("Invalid options provided.");
		}
		this.cookie = options.cookie;
		this.options = options;
	}

	getToken() {
		return this.token;
	}

	setToken(token) {
		this.token = token;
		return this;
	}

	getOptions() {
		return this.options;
	}

	setOptions(options) {
		this.options = options;
		return this;
	}

	getCookie() {
		return this.cookie;
	}

	setCookie(cookie) {
		this.cookie = cookie;
		return this;
	}

	parseCookie(cookie) {
		let cookies = {};
		for (let c of cookie.split(";")) {
			let [key, value] = c.trim().split("=");
			cookies[key] = value;
		}
		return cookies;
	}

	async login(url) {
		let resp = await POST(url, JSON.stringify({"username":this.username, "password":this.password}), {"Content-Type":"application/json"}, this);
		if (resp.status === 200) {
			let cookie = resp.headers.get("set-cookie");
			this.cookie = this.parseCookie(cookie);
			this.token = this.cookie["token"] | null;
		}
		return resp;
	}

	async logout(url) {
		let resp = await POST(url, null, {"Content-Type":"application/json", "Cookie":this.cookie, "Authorization":this.token|null}, this);
		if (resp.status === 200) {
			this.cookie = null;
			this.token = null;
		}
		return this;
	}

	generateHeaders() {
		let headers = {};
		if (this.cookie) {
			headers["Cookie"] = this.cookie;
		}
		if (this.token) {
			headers["Authorization"] = this.token;
		}
		return headers;
	}

	generatePassword(length = 16) {
		return helpers.generatePassword(length);
	}

}

async function GET(url="", params={}, headers = {}, auth) {
	if (auth && auth instanceof AuthManager) {
		headers = Object.assign(auth.generateHeaders(), headers);
	}

	if (params) {
		params = Object.keys(params).map(key => key + "=" + params[key]).join("&");
	}

	const response = await fetch(url+"?"+params, {
		method: "GET",
		body:null,
		headers: headers
	});
	return response;
}

async function POST(url, body, headers = {}, auth) {
	if (auth && auth instanceof AuthManager) {
		headers = Object.assign(auth.generateHeaders(), headers);
	}

	const response = await fetch(url, {
		method: "POST",
		body:body,
		headers: headers
	});
	return response;
}

async function PUT(url, body, headers = {}, auth) {
	if (auth && auth instanceof AuthManager) {
		headers = Object.assign(auth.generateHeaders(), headers);
	}

	const response = await fetch(url, {
		method: "PUT",
		body:body,
		headers: headers
	});
	return response;
}

async function DELETE(url, headers = {}, auth) {
	if (auth && auth instanceof AuthManager) {
		headers = Object.assign(auth.generateHeaders(), headers);
	}

	const response = await fetch(url, {
		method: "DELETE",
		body:null,
		headers: headers
	});
	return response;
}

module.exports = {
	GET,
	POST,
	PUT,
	DELETE,
	AuthManager,
};