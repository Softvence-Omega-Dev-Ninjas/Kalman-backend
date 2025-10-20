import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { fileStorageOptions } from 'src/utils/index.multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

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
              description: 'Roof repair on a two-story house.',
            }),
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'A list of image files for blog',
          },
        },
        required: ['data', 'images'],
      },
    })
  create( @Body('data') jobData: string,
      @UploadedFiles() files: Array<Express.Multer.File>,
      @Req() req: any,) {
        const user=req.user
        const createBlogDto=JSON.parse(jobData)
    return this.blogService.create(createBlogDto,files,user);
  }

  @Get()
  @Public()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
