

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles, 
  BadRequestException,
  Query, 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; 
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { GetJobsFilterDto } from './dto/getAllJobs';
import { fileStorageOptions } from 'src/utils/index.multer';


// -----------------------------------------------------------------------

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, fileStorageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new job posting with multiple images.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'The job data (CreateJobDto) as a JSON string.',
          example: JSON.stringify({
            title: 'Fix Leaky Roof',
            category: ['Construction'],
            description: 'Roof repair on a two-story house.',
            location: 'Suburb X',
            timeline: '3 days',
            contact_method: 'Email',
            skills_needed: ['Roofing', 'Waterproofing'],
          }),
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'A list of image files for the job (up to 10).',
        },
      },
      required: ['data', 'images'],
    },
  })
  async create(
    @Body('data') jobData: string, 
    @UploadedFiles() files: Array<Express.Multer.File>, 
    @Req() req: any,
  ) {
    if (!jobData) {
        throw new BadRequestException('Job data is missing from the request body.');
    }
    let createJobDto: CreateJobDto;
    try {
      createJobDto = JSON.parse(jobData);
    } catch (e) {
      throw new BadRequestException('Invalid JSON format for job data.');
    }
    const user = req.user;
    return this.jobsService.create(createJobDto, user,files);
  }


  @Get()
  @Public()
  @ApiOperation({ summary: 'Retrieve a list of jobs with optional filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of jobs retrieved successfully.',
  })
  findAll(
    @Query() filterDto: GetJobsFilterDto, 
  ) { 
    return this.jobsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}