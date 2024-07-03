import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export default function generateInitFile(options: CreateServerOptions): File {
	const file = {
		path: `${options.outPath}/init.go`,
		content: 'package main\n'
	};

	generateImports(file, options);

	file.content += 'func init() {\n';
	file.content += '\tglobals.Logger = plogger.NewLogger()\n';
	file.content += '\n';
	file.content += '\tvar err error\n';
	file.content += '\n';
	file.content += '\terr = godotenv.Load()\n';
	file.content += '\tif err != nil {\n';
	file.content += '\t\tglobals.Logger.Warningf("Error loading .env file: %s", err.Error())\n';
	file.content += '\t}\n';
	file.content += '\n';

	if (options.usesDatabase) {
		file.content += `\tpostgresURI := os.Getenv("${options.environmentVariablePrefix}_DATABASE_URI")\n`;
		file.content += `\tdatabaseMaxConnectionsStr := cmp.Or(os.Getenv("${options.environmentVariablePrefix}_DATABASE_MAX_CONNECTIONS"), "100")\n`;
	}

	file.content += `\tauthenticationServerPassword := os.Getenv("${options.environmentVariablePrefix}_AUTHENTICATION_PASSWORD")\n`;
	file.content += `\tsecureServerPassword := os.Getenv("${options.environmentVariablePrefix}_SECURE_PASSWORD")\n`;
	file.content += `\taesKey := os.Getenv("${options.environmentVariablePrefix}_AES_KEY")\n`;
	file.content += `\tauthenticationServerPort := os.Getenv("${options.environmentVariablePrefix}_AUTHENTICATION_SERVER_PORT")\n`;
	file.content += `\tsecureServerHost := os.Getenv("${options.environmentVariablePrefix}_SERVER_HOST")\n`;
	file.content += `\tsecureServerPort := os.Getenv("${options.environmentVariablePrefix}_SERVER_PORT")\n`;
	file.content += '\n';

	if (options.usesDatabase) {
		file.content += '\tif strings.TrimSpace(postgresURI) == "" {\n';
		file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_DATABASE_URI environment variable not set")\n`;
		file.content += '\t\tos.Exit(0)\n';
		file.content += '\t}\n';
		file.content += '\n';
		file.content += '\tdatabaseMaxConnections, err := strconv.Atoi(databaseMaxConnectionsStr)\n';
		file.content += '\tif err != nil {\n';
		file.content += `\t\tglobals.Logger.Errorf("${options.environmentVariablePrefix}_DATABASE_MAX_CONNECTIONS is not a valid number. Got %s", databaseMaxConnectionsStr)\n`;
		file.content += '\t\tos.Exit(0)\n';
		file.content += '\t} else {\n';
		file.content += '\t\tglobals.DatabaseMaxConnections = databaseMaxConnections\n';
		file.content += '\t}\n';
		file.content += '\n';
	}

	file.content += '\tif strings.TrimSpace(authenticationServerPassword) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_AUTHENTICATION_PASSWORD environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif strings.TrimSpace(secureServerPassword) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_SECURE_PASSWORD environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif strings.TrimSpace(aesKey) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_AES_KEY environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t} else {\n';
	file.content += `\t\tglobals.AESKey, err = hex.DecodeString(os.Getenv("${options.environmentVariablePrefix}_AES_KEY"))\n`;
	file.content += '\t\tif err != nil {\n';
	file.content += '\t\t\tglobals.Logger.Criticalf("Failed to decode AES key: %v", err)\n';
	file.content += '\t\t\tos.Exit(0)\n';
	file.content += '\t\t}\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif strings.TrimSpace(authenticationServerPort) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_AUTHENTICATION_SERVER_PORT environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif port, err := strconv.Atoi(authenticationServerPort); err != nil {\n';
	file.content += `\t\tglobals.Logger.Errorf("${options.environmentVariablePrefix}_AUTHENTICATION_SERVER_PORT is not a valid port. Expected 0-65535, got %s", authenticationServerPort)\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t} else if port < 0 || port > 65535 {\n';
	file.content += `\t\tglobals.Logger.Errorf("${options.environmentVariablePrefix}_AUTHENTICATION_SERVER_PORT is not a valid port. Expected 0-65535, got %s", authenticationServerPort)\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif strings.TrimSpace(secureServerHost) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_SECURE_SERVER_HOST environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif strings.TrimSpace(secureServerPort) == "" {\n';
	file.content += `\t\tglobals.Logger.Error("${options.environmentVariablePrefix}_SECURE_SERVER_PORT environment variable not set")\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif port, err := strconv.Atoi(secureServerPort); err != nil {\n';
	file.content += `\t\tglobals.Logger.Errorf("${options.environmentVariablePrefix}_SECURE_SERVER_PORT is not a valid port. Expected 0-65535, got %s", secureServerPort)\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t} else if port < 0 || port > 65535 {\n';
	file.content += `\t\tglobals.Logger.Errorf("${options.environmentVariablePrefix}_SECURE_SERVER_PORT is not a valid port. Expected 0-65535, got %s", secureServerPort)\n`;
	file.content += '\t\tos.Exit(0)\n';
	file.content += '\t}\n';

	if (options.usesDatabase) {
		file.content += '\n';
		file.content += '\tdatabase.ConnectPostgres()\n';
	}

	file.content += '}\n';

	return file;
}

function generateImports(file: File, options: CreateServerOptions): void {
	file.content += '\n';
	file.content += 'import (\n';

	if (options.usesDatabase) {
		file.content += '\t"cmp"\n';
	}

	file.content += '\t"encoding/hex"\n';
	file.content += '\t"os"\n';
	file.content += '\t"strconv"\n';
	file.content += '\t"strings"\n';

	if (options.usesDatabase) {
		file.content += `\t"${options.moduleName}/database"\n`;
	}

	file.content += `\t"${options.moduleName}/globals"\n`;
	file.content += '\t"github.com/PretendoNetwork/plogger-go"\n';
	file.content += '\t"github.com/joho/godotenv"\n';
	file.content += ')\n';
	file.content += '\n';
}