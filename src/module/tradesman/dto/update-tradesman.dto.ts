import { PartialType } from '@nestjs/mapped-types';
import { CreateTradesManDto } from './create-tradesman.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTradesManDto extends PartialType(CreateTradesManDto) {
  @ApiPropertyOptional({ description: 'Partial update for tradesman details' })
  note?: string;
}
