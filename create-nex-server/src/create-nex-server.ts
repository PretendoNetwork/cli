#!/usr/bin/env node

// * Largely based on create-next-app
// * https://github.com/vercel/next.js/blob/f03fed0458affd4d2004245c65fbd9e7f47f2245/packages/create-next-app/index.ts
// * https://github.com/vercel/next.js/blob/f03fed0458affd4d2004245c65fbd9e7f47f2245/packages/create-next-app/create-app.ts#26
import { green, cyan, yellow } from 'picocolors';
import { Command } from 'commander';
import prompts from 'prompts';
import semver from 'semver';
import createServer, { CreateServerOptions } from '@/create-server';
import NEX_VERSIONS from '@/nex-versions.json';
import COMMON_PROTOCOLS from '@/common-protocols.json';

// * Just copy what we need from the package.json
// * so it doesn't need to be imported
const packageJson = {
	name: '@pretendonetwork/create-nex-server',
	version: '1.0.0'
};

// * Command can be installed either globally or via npx. Check which was used so we can show
// * the caller the same command they ran in errors/help messages
const isNpx = process.env._ && process.env._.includes('npx') || process.argv[1] && process.argv[1].includes('npx');
const command = isNpx ? `npx ${cyan(packageJson.name)}` : `${cyan(packageJson.name.split('/')[1])}`;

let fullName: string = '';

function handleSigTerm() {
	process.exit(0);
}

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

function onPromptStateAbort() {
	// * If we don't re-enable the terminal cursor before exiting
	// * the program, the cursor will remain hidden
	process.stdout.write('\x1B[?25h');
	process.stdout.write('\n');
	process.exit(1);
}

const promptOptions = {
	onCancel: onPromptStateAbort // * autocomplete does not call onState, need to use onCancel to detect cancelation
};

const program: CreateServerOptions = new Command(command)
	.version(packageJson.version)
	.argument('[server-directory]')
	.usage(`${green('[server-directory]')}`)
	.action((name) => {
		fullName = name?.trim();
	})
	.option('-n, --name <name>', 'Server (full) name')
	.option('-N, --short-name <name>', 'Server (short) name')
	.option('-p, --port <port>', 'Authentication server port. Secure server port is port+1', parseInt)
	.option('-s, --secure-address <address>', 'Secure server address')
	.option('-v, --nex-version <version>', 'Server NEX version')
	.option('-k, --access-key <key>', 'Server access key')
	.option('-S, --session-key-size <size>', 'Size of the session key inside the Kerberos ticket', parseInt)
	.option('-f, --fragment-size <size>', 'Size of DATA packet fragments', parseInt)
	.parse(process.argv)
	.opts();

async function run() {
	if (program.name) {
		fullName = program.name;
	}

	if (!fullName) {
		const response = await prompts({
			type: 'text',
			name: 'path',
			message: 'Server (full) name (e.g., Mario Kart 7):'
		}, promptOptions);

		if (typeof response.path === 'string') {
			program.name = response.path.trim();
		}
	}

	if (!program.name) {
		console.log(
			'\nPlease specify the server name:\n' +
			`    ${command} ${green('<server-name>')}\n` +
			'For example:\n' +
			`    ${command} ${green('friends')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.shortName) {
		console.log(yellow('No short name set. Deriving from full name.'), 'To specify a short name provide', green('--short-name=<name>'));
		program.shortName = program.name;
	}

	if (!program.port || program.port < 60000 || program.port > 65535) {
		const response = await prompts({
			type: 'number',
			name: 'port',
			message: 'Authentication server port (secure server port is port+1):',
			min: 60000,
			max: 65534 // * One less than max, to make room for the secure server port
		}, promptOptions);

		if (typeof response.port === 'number') {
			program.port = response.port;
		}
	}

	if (!program.port) {
		console.log(
			'\nPlease specify a port:\n' +
			`    ${command} ${green('--port=<port>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--port=60000')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.secureAddress) {
		const response = await prompts({
			type: 'text',
			name: 'address',
			message: 'Secure server address:'
		}, promptOptions);

		if (typeof response.address === 'string') {
			program.secureAddress = response.address;
		}
	}

	if (!program.secureAddress) {
		console.log(
			'\nPlease specify a secure server address:\n' +
			`    ${command} ${green('--secure-address=<address>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--secure-address=d-ha2j-secure.example.com')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.nexVersion) {
		let typedValue = ''; // * Allow the user to type in a custom version not in the list
		const response = await prompts({
			type: 'autocomplete',
			name: 'version',
			message: 'NEX version:',
			choices: NEX_VERSIONS.map(version => ({ title: version, value: version })),
			onRender() {
				typedValue = (this as any).input; // TODO - Augment the prompts type defs
			}
		}, promptOptions);

		if (typeof response.version === 'string') {
			program.nexVersion = response.version.trim();
		} else {
			typedValue = typedValue.trim();

			if (semver.valid(typedValue)) {
				program.nexVersion = typedValue;
			}
		}
	}

	if (!program.nexVersion) {
		console.log(
			'\nPlease specify a valid (semver) NEX version:\n' +
			`    ${command} ${green('--nex-version=<version>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--nex-version=3.10.0')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.accessKey) {
		const response = await prompts({
			type: 'text',
			name: 'key',
			message: 'Server access key (e.g, ridfebb9):'
		}, promptOptions);

		if (typeof response.key === 'string') {
			program.accessKey = response.key.trim();
		}
	}

	if (!program.accessKey) {
		console.log(
			'\nPlease specify a server access key:\n' +
			`    ${command} ${green('--access-key=<key>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--access-key=ridfebb9')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.sessionKeySize) {
		let typedValue = ''; // * Allow the user to type in a custom size not in the list
		const response = await prompts({
			type: 'autocomplete',
			name: 'size',
			message: 'Session key size:',
			choices: [
				{ title: '32 bytes', value: 32 },
				{ title: '16 bytes', value: 16 }
			],
			onRender() {
				typedValue = (this as any).input; // TODO - Augment the prompts type defs
			}
		}, promptOptions);

		if (typeof response.size === 'number') {
			program.sessionKeySize = response.size;
		} else {
			const size = parseInt(typedValue.trim());

			if (size) {
				program.sessionKeySize = size;
			}
		}
	}

	if (!program.sessionKeySize) {
		console.log(
			'\nPlease specify a session key size:\n' +
			`    ${command} ${green('--session-key-size=<size>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--session-key-size=32')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	if (!program.fragmentSize) {
		let typedValue = ''; // * Allow the user to type in a custom size not in the list
		const response = await prompts({
			type: 'autocomplete',
			name: 'size',
			message: 'Fragment size:',
			choices: [
				{ title: '1300 bytes (default for PRUDPv1)', value: 1300 },
				{ title: '900 bytes (default for PRUDPv0)', value: 900 }
			],
			onRender() {
				typedValue = (this as any).input; // TODO - Augment the prompts type defs
			}
		}, promptOptions);

		if (typeof response.size === 'number') {
			program.fragmentSize = response.size;
		} else {
			const size = parseInt(typedValue.trim());

			if (size) {
				program.fragmentSize = size;
			}
		}
	}

	if (!program.fragmentSize) {
		console.log(
			'\nPlease specify a fragment size:\n' +
			`    ${command} ${green('--fragment-size=<size>')}\n` +
			'For example:\n' +
			`    ${command} ${green('--fragment-size=1300')}\n\n` +
			`Run ${command} ${green('--help')} to see all options.`
		);

		process.exit(1);
	}

	const response = await prompts({
		type: 'autocompleteMultiselect',
		name: 'protocols',
		message: 'Protocols from "common" library:',
		choices: COMMON_PROTOCOLS.map(protocol => ({ title: protocol, value: protocol.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '') })),
	}, promptOptions);

	if (response.protocols.includes('datastore') || response.protocols.includes('ranking')) {
		const response = await prompts({
			type: 'text',
			name: 'uri',
			message: 'Postgres URI:',
		}, promptOptions);

		if (typeof response.uri === 'string') {
			program.databaseURI = response.uri;
		} else {
			console.log(`\nA Postgres database URI is required when using either the ${green('DataStore')} or ${green('Ranking')} protocols`);

			process.exit(1);
		}
	}

	createServer({
		...program,
		commonProtocols: response.protocols
	});
}

run();