import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { fileStorageOptions } from 'src/utils/index.multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  
  // CREATE NEW BLOG
  
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, fileStorageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new blog post with multiple images.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'The blog data as a JSON string.',
          example: JSON.stringify({
            title: 'Fix Leaky Roof',
            description: 'Roof repair on a two-story house.',
          }),
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'A list of image files for the blog',
        },
      },
      required: ['data'],
    },
  })
  create(
    @Body('data') blogData: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
   try{
     const user = req.user;
    const createBlogDto = JSON.parse(blogData);
    return this.blogService.create(createBlogDto, files, user);
   }catch(e){
    throw new BadRequestException(e.message)
   }
  }

  
  // UPDATE BLOG (PATCH)
  
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10, fileStorageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing blog with optional new images.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'Updated blog data as a JSON string.',
          example: JSON.stringify({
            title: 'Updated Blog Title',
            description: 'Updated description content.',
          }),
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional new images for the blog (max 10)',
        },
      },
      required: ['data'],
    },
  })
  update(
    @Param('id') id: string,
    @Body('data') blogData: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
  try{
    const user = req.user;
    const updateBlogDto = JSON.parse(blogData);
    return this.blogService.update(id, updateBlogDto, files, user);
  }catch(e){
    throw new BadRequestException(e.message)
  }
  }

  @Delete('blog/:id/images/:index')
  @ApiOperation({ summary: 'Delete an image from a blog by index.' })
  async deleteImage(@Param('id') id:string, @Param('index') index:number){
    try{
      return this.blogService.removeImage(id, index);
    }catch(e){
      throw new BadRequestException(e.message)
    }
    }
  
  // GET ALL BLOGS
  
  @Get()
  @Public()
  findAll() {
    try{
      return this.blogService.findAll();
    }catch(e){
      throw new BadRequestException(e.message)
    }
  }

  
  // GET SINGLE BLOG
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    try{
      return this.blogService.findOne(id);
    }catch(e){
      throw new BadRequestException(e.message)
    }
  }

  
  // DELETE BLOG
  
  @Delete(':id')
  remove(@Param('id') id: string) {
   try{
    return this.blogService.remove(id);
   }catch(e){
    throw new BadRequestException(e.message)
   }
  }

  
}
