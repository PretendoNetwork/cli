import fs from 'fs-extra';
import { cyan } from 'picocolors';
import { generateInitFile } from '@/file-generators';
import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export default function createServer(options: CreateServerOptions): void {
	options.usesDatabase = options.commonProtocols.includes('datastore') || options.commonProtocols.includes('ranking');
	options.outPath = `${process.cwd()}/${options.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
	options.environmentVariablePrefix = `PN_${options.shortName.toUpperCase().replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '')}_CONFIG`;
	options.moduleName = `github.com/PretendoNetwork/${options.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;

	console.log('Generating source files...');

	const files = generateSourceFiles(options);

	console.log(`Writing NEX server to ${cyan(options.outPath)}`);

	for (const file of files) {
		fs.ensureFileSync(file.path);
		fs.writeFileSync(file.path, file.content);
	}
}

function generateSourceFiles(options: CreateServerOptions): File[] {
	const files = [
		generateInitFile(options)
	];

	return files;
}