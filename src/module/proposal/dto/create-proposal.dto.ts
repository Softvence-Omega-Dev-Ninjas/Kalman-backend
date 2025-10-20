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
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'c1e2f3a4-b5d6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  @IsNotEmpty()
  tradesManId: string;

  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;
}
