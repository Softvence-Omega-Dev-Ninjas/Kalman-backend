import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(createReviewDto: CreateReviewDto, id: string) {
    const result = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        customerId: id,
      },
    });

    return result;
  }

  async findAll() {
    const result = await this.prisma.review.findMany({
      include: {
        customer: true,
        tradesMan: true,
      },
    });
    return result;
  }

  async findMyReview(id: string) {
    const result = await this.prisma.review.findMany({
      where: {
        tradesManId: id,
      },
      include: {
        customer: true,
        tradesMan: true,
      },
    });
    if (!result) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });
    if (!result) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
