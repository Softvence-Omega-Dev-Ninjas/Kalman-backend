import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ProposalStatus } from '@prisma/client'; // or define manually if not imported from Prisma

export class CreateProposalDto {
  @ApiProperty({
    example:
      'A well-detailed proposal describing my approach to complete the job efficiently.',
    description: 'Description of the proposal provided by the user.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'c1e2f3a4-b5d6-7890-1234-56789abcdef0',
    description: 'ID of the job this proposal is related to.',
  })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'ID of the user submitting the proposal.',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  //   @ApiProperty({
  //     example: ProposalStatus.PENDING,
  //     enum: ProposalStatus,
  //     description: 'Current status of the proposal.',
  //   })
  //   @IsEnum(ProposalStatus)
  //   @IsOptional()
  //   status?: ProposalStatus;
}
