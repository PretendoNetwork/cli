import type CreateServerOptions from '@/types/create-server-options';
import type File from '@/types/file';

export default function generateAccountDetailsByUsernameFile(options: CreateServerOptions): File {
	const file = {
		path: `${options.outPath}/globals/account_details_by_username.go`,
		content: 'package globals\n'
	};

	file.content += '\n';
	file.content += 'import (\n';
	file.content += '\t"context"\n';
	file.content += '\t"fmt"\n';
	file.content += '\t"strconv"\n';
	file.content += '\n';
	file.content += '\tpb "github.com/PretendoNetwork/grpc-go/account"\n';
	file.content += '\t"github.com/PretendoNetwork/nex-go/v2"\n';
	file.content += '\t"github.com/PretendoNetwork/nex-go/v2/types"\n';
	file.content += '\t"google.golang.org/grpc/metadata"\n';
	file.content += ')\n';
	file.content += '\n';
	file.content += '\tif username == AuthenticationEndpoint.ServerAccount.Username {\n';
	file.content += '\t\treturn AuthenticationEndpoint.ServerAccount, nil\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\tif username == SecureEndpoint.ServerAccount.Username {\n';
	file.content += '\t\treturn SecureEndpoint.ServerAccount, nil\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\t// TODO - This is fine for our needs, but not for servers which use non-PID usernames?\n';
	file.content += '\tpid, err := strconv.Atoi(username)\n';
	file.content += '\tif err != nil {\n';
	file.content += '\t\tfmt.Println(1)\n';
	file.content += '\t\tfmt.Println(err)\n';
	file.content += '\t\treturn nil, nex.NewError(nex.ResultCodes.RendezVous.InvalidUsername, "Invalid username")\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\t// * Trying to use AccountDetailsByPID here led to weird nil checks?\n';
	file.content += '\t// * Would always return an error even when it shouldn\'t.\n';
	file.content += '\t// TODO - Look into this more\n';
	file.content += '\n';
	file.content += '\tctx := metadata.NewOutgoingContext(context.Background(), GRPCAccountCommonMetadata)\n';
	file.content += '\n';
	file.content += '\tresponse, err := GRPCAccountClient.GetNEXPassword(ctx, &pb.GetNEXPasswordRequest{Pid: uint32(pid)})\n';
	file.content += '\tif err != nil {\n';
	file.content += '\t\tLogger.Error(err.Error())\n';
	file.content += '\t\treturn nil, nex.NewError(nex.ResultCodes.RendezVous.InvalidPID, "Invalid PID")\n';
	file.content += '\t}\n';
	file.content += '\n';
	file.content += '\taccount := nex.NewAccount(types.NewPID(uint64(pid)), username, response.Password)\n';
	file.content += '\n';
	file.content += '\treturn account, nil\n';
	file.content += '}\n';

	return file;
}