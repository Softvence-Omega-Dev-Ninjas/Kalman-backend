import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    description: 'Create Category with image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        subCategories: {
          type: 'array',
          items: { type: 'string' },
          example: ['sub1', 'sub2'],
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'image'],
    },
  })
  async create(
    @Body() createCategoryDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parseJSONField = (field: string) => {
      try {
        return field ? JSON.parse(field) : undefined;
      } catch (err) {
        console.warn(`Failed to parse ${field}:`, err);
        return undefined;
      }
    };
    const parsedCategory = parseJSONField(createCategoryDto.subCategories);
    // console.log({ createCategoryDto, parsedCategory, file });
    // return createCategoryDto;
    return this.categoryService.create(
      { name: createCategoryDto?.name, subCategories: parsedCategory },
      file,
    );
  }
  @Get()
  @Public()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of records to return per page',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Number of records to skip (for pagination)',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search tradesmen by name, email, or any related field',
    example: 'Category 1',
  })
  findAll(@Query() query: { search: string; limit: string; page: string }) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
