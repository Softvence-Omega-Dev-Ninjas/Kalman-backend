import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocsDto {
  @ApiProperty({ example: 'License' })
  @IsString()
  type: string;
}
