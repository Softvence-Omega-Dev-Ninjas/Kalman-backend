import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({
    example: 'job_12345',
    description: 'The unique ID of the job related to this invitation',
  })
  @IsString()
  @IsNotEmpty()
  jobId: string;

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
}
