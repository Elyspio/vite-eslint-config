// eslint-disable-next-line @typescript-eslint/no-var-requires,import/extensions
const prettierConfig = require("./.prettierrc.js");

module.exports = {
	parser: "@typescript-eslint/parser",
	extends: ["airbnb", "airbnb-typescript", "airbnb/hooks", "prettier", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
	plugins: ["prettier"],
	parserOptions: {
		project: "./tsconfig.json",
	},
	rules: {
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"prettier/prettier": ["warn", prettierConfig],
		"import/prefer-default-export": "off",
		"no-void": "off"
	},
};
