export type CreateServerOptions = {
	name: string;
	shortName: string;
	nexVersion: string;
	accessKey: string;
	sessionKeySize: number;
	fragmentSize: number;
	commonProtocols: string[];
}

export default function createServer(options: CreateServerOptions): void {
	console.log(options);
}