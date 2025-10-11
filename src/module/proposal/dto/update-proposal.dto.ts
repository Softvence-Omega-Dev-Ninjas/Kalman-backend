import { PartialType } from '@nestjs/swagger';
import { CreateProposalDto } from './create-proposal.dto';
import { ProposalStatus } from '@prisma/client';

export class UpdateProposalDto extends PartialType(CreateProposalDto) {}
