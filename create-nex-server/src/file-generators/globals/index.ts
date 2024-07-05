import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export { default as generateAccountDetailsByPIDFile } from '@/file-generators/globals/account_details_by_pid.go';
export { default as generateAccountDetailsByUsernameFile } from '@/file-generators/globals/account_details_by_username.go';

export default function generateGlobalsFile(options: CreateServerOptions): File {
	const file = {
		path: `${options.outPath}/globals/globals.go`,
		content: 'package globals\n'
	};

	file.content += '\n';
	file.content += 'import (\n';
	file.content += '\tpb "github.com/PretendoNetwork/grpc-go/account"\n';
	file.content += '\t"github.com/PretendoNetwork/nex-go/v2"\n';
	file.content += '\t"github.com/PretendoNetwork/plogger-go"\n';
	file.content += '\t"google.golang.org/grpc"\n';
	file.content += '\t"google.golang.org/grpc/metadata"\n';
	file.content += ')\n';
	file.content += '\n';
	file.content += 'var Logger *plogger.Logger\n';
	file.content += '\n';
	file.content += 'var AuthenticationServer *nex.PRUDPServer\n';
	file.content += 'var AuthenticationEndpoint *nex.PRUDPEndPoint\n';
	file.content += '\n';
	file.content += 'var SecureServer *nex.PRUDPServer\n';
	file.content += 'var SecureEndpoint *nex.PRUDPEndPoint\n';
	file.content += '\n';
	file.content += 'var GRPCAccountClientConnection *grpc.ClientConn\n';
	file.content += 'var GRPCAccountClient pb.AccountClient\n';
	file.content += 'var GRPCAccountCommonMetadata metadata.MD\n';

	return file;
}