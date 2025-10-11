import { PartialType } from '@nestjs/swagger';
import { CreateProposalDto } from './create-proposal.dto';
import { $Enums } from '@prisma/client';

export class UpdateProposalDto extends PartialType(CreateProposalDto) {
  status?: $Enums.ProposalStatus | undefined;
}
