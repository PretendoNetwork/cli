import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
	{files: ['**/*.{js,mjs,cjs,ts}']},
	{languageOptions: { globals: globals.node }},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'one-var': [
				'error',
				'never'
			],
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1
				}
			],
			quotes: [
				'error',
				'single'
			],
			semi: [
				'error',
				'always'
			],
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	}
];