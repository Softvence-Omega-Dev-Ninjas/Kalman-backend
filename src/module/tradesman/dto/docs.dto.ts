import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocsDto {
  @ApiProperty({ example: 'License' })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'https://example.com/uploads/license.jpg',
    description: 'Document URL',
  })
  @IsString()
  url: string;
}
