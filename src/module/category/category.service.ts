import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { saveFileAndGetUrl } from 'src/utils/saveFileAndGetUrl';
import { CreateCategoryDto } from './dto/create-category.dto';
import { saveFile } from 'src/utils/saveFiles';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const isCategoryExist = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto?.name,
      },
    });
    if (isCategoryExist) {
      throw new HttpException('Category already exist', HttpStatus.CONFLICT);
    }
    const url = await saveFile(file);
    console.log({ url });
    const result = await this.prisma.category.create({
      data: {
        image: url.url,
        name: createCategoryDto?.name,
        subCategories: createCategoryDto?.subCategories,
      },
    });
    return result;
  }

  async findAll(query: { search: string; limit: string; page: string }) {
    const limit = Number(query?.limit) || 10;
    const page = Number(query?.page) || 1;
    const skip = (page - 1) * limit;
    const filters: any[] = [];
    if (query?.search) {
      filters.push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      });
    }
    const result = await this.prisma.category.findMany({
      where: {
        AND: filters,
      },
      include: {
        jobs: true,
      },
      skip,
      take: limit,
    });
    return {
      result,
      metadata: {
        page,
        limit,
        totalPages: Math.ceil((await this.prisma.category.count()) / limit),
        totalItem: await this.prisma.category.count(),
      },
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.category.findFirst({
      where: {
        id,
      },
      include: {
        jobs: true,
      },
    });
    if (!result) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: updateCategoryDto?.name,
        subCategories: updateCategoryDto?.subCategories,
      },
      include: {
        jobs: true,
      },
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.category.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
