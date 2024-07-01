import fs from 'fs-extra';
import { cyan } from 'picocolors';

export type CreateServerOptions = {
	name: string;
	shortName: string;
	port: number;
	secureAddress: string;
	nexVersion: string;
	accessKey: string;
	sessionKeySize: number;
	fragmentSize: number;
	commonProtocols: string[];
}

export default function createServer(options: CreateServerOptions): void {
	console.log(options);

	const outPath = `${process.cwd()}/${options.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
	//const environmentVariablePrefix = options.shortName.toUpperCase().replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '');

	console.log(`Writing NEX server to ${cyan(outPath)}`);

	fs.ensureDirSync(outPath);

	// TODO - Copy from template? String build everything?
}