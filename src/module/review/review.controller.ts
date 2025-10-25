import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    try {
      const user = req?.user;
      console.log({ userwefs: user });

      return this.reviewService.create(createReviewDto, user?.id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get()
  findAll() {
    try {
      return this.reviewService.findAll();
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.reviewService.findOne(id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    try {
      return this.reviewService.update(+id, updateReviewDto);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.reviewService.remove(+id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }
}
