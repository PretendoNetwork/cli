import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export default function generateAccountDetailsByPIDFile(options: CreateServerOptions): File {
	const file = {
		path: `${options.outPath}/globals/account_details_by_pid.go`,
		content: 'package globals\n'
	};

	file.content += '\n';
	file.content += 'import (\n';
	file.content += '\t"context"\n';
	file.content += '\t"strconv"\n';
	file.content += '\n';
	file.content += '\tpb "github.com/PretendoNetwork/grpc-go/account"\n';
	file.content += '\t"github.com/PretendoNetwork/nex-go/v2"\n';
	file.content += '\t"github.com/PretendoNetwork/nex-go/v2/types"\n';
	file.content += '\t"google.golang.org/grpc/metadata"\n';
	file.content += ')\n';
	file.content += '\n';
	file.content += 'func AccountDetailsByPID(pid *types.PID) (*nex.Account, *nex.Error) {\n';
	file.content += '\tif pid.Equals(AuthenticationEndpoint.ServerAccount.PID) {\n';
	file.content += '\t\treturn AuthenticationEndpoint.ServerAccount, nil\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif pid.Equals(SecureEndpoint.ServerAccount.PID) {\n';
	file.content += '\t\treturn SecureEndpoint.ServerAccount, nil\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tctx := metadata.NewOutgoingContext(context.Background(), GRPCAccountCommonMetadata)\n';
	file.content += '\n';
	file.content += '\tresponse, err := GRPCAccountClient.GetNEXPassword(ctx, &pb.GetNEXPasswordRequest{Pid: pid.LegacyValue()})\n';
	file.content += '\tif err != nil {\n';
	file.content += '\t\tLogger.Error(err.Error())\n';
	file.content += '\t\treturn nil, nex.NewError(nex.ResultCodes.RendezVous.InvalidPID, "Invalid PID")\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tusername := strconv.Itoa(int(pid.Value()))\n';
	file.content += '\taccount := nex.NewAccount(pid, username, response.Password)\n';
	file.content += '\n';
	file.content += '\treturn account, nil\n';
	file.content += '}\n';

	return file;
}