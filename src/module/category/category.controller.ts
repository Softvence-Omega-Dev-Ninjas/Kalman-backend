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
// import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, file);
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
