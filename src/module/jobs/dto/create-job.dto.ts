import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  ArrayNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    description: 'The title of the job.',
    example: 'Frontend Developer for E-commerce Site',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A list of categories the job belongs to.',
    example: ['Software Development', 'Web Design'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  category: string[];

  @ApiProperty({
    description: 'A detailed description of the job requirements and scope.',
    example: 'Need a skilled React developer to build a responsive e-commerce front-end.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The location where the job will be performed (e.g., Remote, City Name).',
    example: 'Remote',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'The expected timeline or duration for the job.',
    example: '3-6 months',
  })
  @IsNotEmpty()
  @IsString()
  timeline: string;

  @ApiPropertyOptional({
    description: 'The preferred start date for the job (optional).',
    example: '2024-12-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  preferred_date?: Date;

  @ApiPropertyOptional({
    description: 'The preferred time for the job/meetings (optional).',
    example: '2024-12-01T10:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  preferred_time?: Date;

  @ApiPropertyOptional({
    description: 'A list of image URLs related to the job (optional).',
    example: ['https://example.com/img1.png', 'https://example.com/img2.png'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

  @ApiProperty({
    description: 'The preferred method for contact (e.g., Email, Phone, Platform Chat).',
    example: 'Platform Chat',
  })
  @IsNotEmpty()
  @IsString()
  contact_method: string;

  @ApiPropertyOptional({
    description: 'The fee for being shortlisted for this job (defaults to 20).',
    example: 20.0,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shortlist_fee?: number;

  @ApiProperty({
    description: 'A list of skills required for the job.',
    example: ['React', 'TypeScript', 'Prisma', 'NestJS'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills_needed: string[];
}