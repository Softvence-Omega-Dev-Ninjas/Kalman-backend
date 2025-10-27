import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {

  @ApiProperty({
    example: 'tradesman_98765',
    description: 'The unique ID of the tradesman being invited',
  })
  @IsString()
  @IsNotEmpty()
  tradesManId: string;

  @ApiProperty({
    example: 'Hello, we’d like to invite you for this job opportunity!',
    description: 'A personalized message sent to the tradesman',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'The location of the job opportunity',
  })
  @IsString()
  @IsNotEmpty()
  location:string
}
