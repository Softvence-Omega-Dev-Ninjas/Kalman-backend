import { Controller, Get, Post, Body} from '@nestjs/common';
import { NewsLetterService } from './news-letter.service';
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';

@Controller('news-letter')
export class NewsLetterController {
  constructor(private readonly newsLetterService: NewsLetterService) {}

  @Post()
  create(@Body() createNewsLetterDto: CreateNewsLetterDto) {
    return this.newsLetterService.create(createNewsLetterDto);
  }

  @Get()
  findAll() {
    return this.newsLetterService.findAll();
  }

}
