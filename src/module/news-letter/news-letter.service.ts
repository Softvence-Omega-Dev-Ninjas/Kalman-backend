import { Injectable } from '@nestjs/common';
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NewsLetterService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  async create(createNewsLetterDto: CreateNewsLetterDto) {
    await Promise.all([
      this.mailService.sendMail({
        to: createNewsLetterDto.email,
        subject: 'Thanks for subscribing to our newsletter',
        html: `<h1>Thanks for subscribing to our newsletter</h1>`,
      }),
      this.mailService.sendMail({
        to: 'dev.milonhossain32@gmail.com',
        subject: 'Message for clinet',
        html: `<h1>New newsletter subscription</h1>
        <p>Name: ${createNewsLetterDto.name}</p>
        <p>Email: ${createNewsLetterDto.email}</p>
        <p>Message: ${createNewsLetterDto.message}</p>
        `,
      }),
      this.prisma.news_letter.create({
        data: createNewsLetterDto,
      }),
    ]);
    return {
      message: 'Thanks for message we will reach out immediatly',
    };
  }

  async findAll() {
    const res = await this.prisma.news_letter.findMany();
    return res;
  }
}
