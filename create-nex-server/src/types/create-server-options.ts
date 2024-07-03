type CreateServerOptions = {
	// * These are set in the question prompts
	name: string;
	shortName: string;
	port: number;
	secureAddress: string;
	nexVersion: string;
	accessKey: string;
	sessionKeySize: number;
	fragmentSize: number;
	commonProtocols: string[];
	databaseURI?: string;

	// * These are set in createServer
	usesDatabase: boolean;
	outPath: string;
	environmentVariablePrefix: string;
	moduleName: string;
}

export default CreateServerOptions;