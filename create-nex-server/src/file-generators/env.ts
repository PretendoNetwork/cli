import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export default function generateDotEnvFile(options: CreateServerOptions): File {
	const file = {
		path: `${options.outPath}/.env`,
		content: ''
	};

	// TODO - Make these MORE configurable?
	file.content += `${options.environmentVariablePrefix}_AES_KEY="0000000000000000000000000000000000000000000000000000000000000000"\n`;
	file.content += `${options.environmentVariablePrefix}_AUTHENTICATION_PASSWORD="password"\n`;
	file.content += `${options.environmentVariablePrefix}_AUTHENTICATION_SERVER_PORT="${options.port}"\n`;
	file.content += `${options.environmentVariablePrefix}_SECURE_PASSWORD="password"\n`;
	file.content += `${options.environmentVariablePrefix}_SECURE_SERVER_HOST="${options.secureAddress}"\n`;
	file.content += `${options.environmentVariablePrefix}_SECURE_SERVER_PORT="${options.port+1}"\n`;
	file.content += `${options.environmentVariablePrefix}_ACCOUNT_GRPC_HOST=""\n`;
	file.content += `${options.environmentVariablePrefix}_ACCOUNT_GRPC_PORT=""\n`;
	file.content += `${options.environmentVariablePrefix}_ACCOUNT_GRPC_API_KEY=""\n`;

	return file;
}