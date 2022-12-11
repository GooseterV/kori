module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"warn",
			"always"
		],
		"no-unused-vars": [
			"warn"
		],
		"no-undef": [
			"warn"
		],
		"no-irregular-whitespace": [
			"warn"
		]
	}
};
