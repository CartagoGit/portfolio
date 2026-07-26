/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 CartagoGit.
 *
 * Flat config de ESLint v9 para el repo `portfolio`. Mantiene paridad con
 * `Beateam/logistics-app/config/eslint/eslint.config.ts` (mismas reglas,
 * mismo `naming-convention`, mismas banned patterns). Cuando un archivo se
 * migra de un repo a otro, las reglas lint se aplican idénticamente.
 *
 * Tipado: el `default export` es un `Linter.Config[]` para que los importers
 * (specs, scripts de Bun) vean el tipo real y TS no proteste con TS7016.
 *
 * Runtime: se ejecuta con Bun (que provee el loader de TS para `--config`
 * de ESLint) tanto en `bun run lint:*` como en specs. En host sin Bun, los
 * `lint:*` se siguen apoyando en el binario `eslint` v9.18+.
 */
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import checkFilePlugin from 'eslint-plugin-check-file';
import globals from 'globals';
import path from 'node:path';

const configDir = import.meta.dirname;
const repoRoot = path.resolve(configDir, '..', '..');

const globalTypeNameAllowlist = 'Navigator|Window|Document|ImportMeta|ProcessEnv';

const sharedTsRules = {
	'@typescript-eslint/no-explicit-any': 'warn',
	'@typescript-eslint/no-unused-private-class-members': 'warn',
	'@typescript-eslint/naming-convention': [
		'warn',
		{
			selector: 'objectLiteralProperty',
			filter: {
				regex: '(^[A-Z0-9_]+$)|(^[A-Z][A-Za-z0-9]*$)|_|-|^\\[|[^A-Za-z0-9]',
				match: true,
			},
			format: null,
		},
		{
			selector: 'objectLiteralMethod',
			filter: {
				regex: '(^[A-Z][A-Za-z0-9]*$)|_|-|^\\[|[^A-Za-z0-9]',
				match: true,
			},
			format: null,
		},
		{
			selector: 'typeProperty',
			filter: {
				regex: '(^[A-Z0-9_]+$)|(^[A-Z][A-Za-z0-9]*$)|_|-|^\\[|[^A-Za-z0-9]',
				match: true,
			},
			format: null,
		},
		{
			selector: 'classProperty',
			modifiers: ['public'],
			format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
			leadingUnderscore: 'forbid',
		},
		{
			selector: 'classProperty',
			modifiers: ['protected'],
			format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
			leadingUnderscore: 'require',
		},
		{
			selector: 'classProperty',
			modifiers: ['private'],
			format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
			leadingUnderscore: 'require',
		},
		{
			selector: 'classProperty',
			format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
			leadingUnderscore: 'allow',
		},
		{
			selector: 'parameter',
			modifiers: ['unused'],
			format: ['camelCase'],
			leadingUnderscore: 'allow',
		},
		{
			selector: 'parameter',
			format: ['camelCase'],
			leadingUnderscore: 'forbid',
		},
		{
			selector: 'variable',
			modifiers: ['unused'],
			format: ['camelCase', 'UPPER_CASE'],
			leadingUnderscore: 'allow',
		},
		{
			selector: 'variable',
			format: ['camelCase', 'UPPER_CASE'],
			leadingUnderscore: 'forbid',
		},
		{
			selector: 'interface',
			filter: {
				regex: `^(?:${globalTypeNameAllowlist})$`,
				match: false,
			},
			format: ['PascalCase'],
			custom: {
				regex: '^I(?:[A-Z]|\\d)',
				match: true,
			},
		},
		{
			selector: 'typeAlias',
			filter: {
				regex: `^(?:${globalTypeNameAllowlist})$`,
				match: false,
			},
			format: ['PascalCase'],
			custom: {
				regex: '^I(?:[A-Z]|\\d)',
				match: true,
			},
		},
	],
	'no-empty-function': 'off',
	'@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': [
		'warn',
		{
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_',
			destructuredArrayIgnorePattern: '^_',
		},
	],
	'no-duplicate-imports': 'error',
	'@typescript-eslint/consistent-type-imports': [
		'error',
		{ prefer: 'type-imports', fixStyle: 'separate-type-imports' },
	],
	'no-throw-literal': 'error',
	'no-var': 'error',
	'prefer-const': 'warn',
	eqeqeq: ['warn', 'smart'],
	'no-debugger': 'error',
	'no-eval': 'error',
	'no-undef': 'off',
	'no-restricted-imports': ['error', 'rxjs/Rx'],
	// Más de 2 parámetros → agrupar en un objeto de opciones para que las
	// firmas sean legibles y los call sites autodocumentados.
	'@typescript-eslint/max-params': [
		'warn',
		{
			max: 2,
			countVoidThis: false,
			// Allow Express/Vitest callbacks which always use 3 params
			// (`(req, res, next)` / `(done) => ...`). The rule already handles
			// `done` via the `countVoidThis` flag; for Express we relax to 3
			// and rely on the inline refactor to object-args where it fits.
		},
	],
	'@typescript-eslint/max-params': [
		'warn',
		{ max: 2, countVoidThis: false },
	],
	// Orden estable de imports (mismo grupo, alfabético dentro).
	'sort-imports': [
		'warn',
		{
			ignoreCase: true,
			ignoreDeclarationSort: true,
			ignoreMemberSort: false,
			memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
		},
	],
	// Consistencia de estilo en la salida del repo.
	'@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
	'@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
};

const config = [
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
	},
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'build/**',
			'**/*.d.ts',
			'plugins/**',
			'tools/mcp-vertex/**',
			'.angular/**',
			'.cache/angular/**',
			'.cache/eslint/**',
			'.cache/coverage/**',
			'public/**',
		],
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: 'config/eslint/tsconfig.eslint.json',
				sourceType: 'module',
				tsconfigRootDir: repoRoot,
			},
			globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'@angular-eslint': angularPlugin,
			'check-file': checkFilePlugin,
		},
		rules: {
			...sharedTsRules,
			'@angular-eslint/prefer-signals': [
				'warn',
				{
					preferReadonlySignalProperties: true,
					preferInputSignals: true,
					preferQuerySignals: true,
					useTypeChecking: true,
				},
			],
			'@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component', 'Page'] }],
			'@angular-eslint/component-selector': [
				'error',
				{ type: 'element', prefix: 'app', style: 'kebab-case' },
			],
			'@angular-eslint/directive-class-suffix': 'error',
			'@angular-eslint/no-input-rename': 'error',
			'@angular-eslint/no-output-on-prefix': 'off',
			'@angular-eslint/no-output-rename': 'error',
			'@typescript-eslint/await-thenable': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-misused-promises': 'warn',
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
			'@typescript-eslint/only-throw-error': 'warn',
			'no-restricted-syntax': [
				'error',
				{
					selector:
						"Decorator[expression.callee.name='HostListener']",
					message:
						"Use host metadata (host: { '(event)': 'method($event)' }) instead of @HostListener. See proposal P39.",
				},
				{
					selector:
						"Decorator[expression.callee.name='HostBinding']",
					message:
						"Use host metadata (host: { '[property]': 'value' }) instead of @HostBinding. See proposal P39.",
				},
			],
			'no-console': ['warn', { allow: ['warn', 'error', 'log', 'debug'] }],
		},
	},
	{
		files: ['src/app/**/*.ts', 'src/core/**/*.ts', 'src/shared/**/*.ts'],
		rules: {
			'@typescript-eslint/naming-convention': [
				...sharedTsRules['@typescript-eslint/naming-convention'],
			],
		},
	},
	{
		files: ['src/**/*.html'],
		languageOptions: {
			parser: angularTemplateParser,
		},
		plugins: {
			'@angular-eslint/template': angularTemplatePlugin,
		},
		rules: {
			'@angular-eslint/template/banana-in-box': 'error',
			'@angular-eslint/template/eqeqeq': 'warn',
			'@angular-eslint/template/no-any': 'error',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 6 }],
			'@angular-eslint/template/prefer-control-flow': 'warn',
			'@angular-eslint/template/no-negated-async': 'warn',
		},
	},
	{
		files: ['src/**/*.spec.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: 'config/eslint/tsconfig.eslint-spec.json',
				sourceType: 'module',
				tsconfigRootDir: repoRoot,
			},
			globals: { ...globals.node, ...globals.es2021 },
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...sharedTsRules,
			'@typescript-eslint/no-empty-function': 'off',
			'no-console': 'off',
		},
	},
	{
		files: ['config/**/*.ts', 'tools/**/*.ts', '*.config.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: 'config/eslint/tsconfig.eslint-tools.json',
				sourceType: 'module',
				tsconfigRootDir: repoRoot,
			},
			globals: { ...globals.node, ...globals.es2021 },
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...sharedTsRules,
			'no-console': 'off',
		},
	},
	{
		// Express middleware signatures are fixed by the framework: every
		// callback is `(req, res, next)`. Allowing 3 params here is the only
		// way to keep the rule enabled for the rest of the codebase.
		files: ['src/server.ts'],
		rules: {
			'@typescript-eslint/max-params': 'off',
		},
	},
] as unknown as Linter.Config[];

export default config;