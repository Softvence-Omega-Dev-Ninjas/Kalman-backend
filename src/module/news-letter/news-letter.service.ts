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
    const userHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; color: #333;">
    <h1 style="color: #ff6600; text-align: center;">Thank You for Subscribing!</h1>
    <p>Hi ${createNewsLetterDto.name},</p>
    <p>Thank you for subscribing to our newsletter! We’re excited to keep you updated with our latest news and offers.</p>
    <p style="text-align: center;">
      <a href="#" style="background-color: #ff6600; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </p>
    <p style="font-size: 12px; color: #888; text-align: center;">If you did not subscribe, please ignore this email.</p>
  </div>
  `;

    const adminHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd; color: #333;">
    <h2 style="color: #007bff;">New Newsletter Subscription</h2>
    <p><strong>Name:</strong> ${createNewsLetterDto.name}</p>
    <p><strong>Email:</strong> ${createNewsLetterDto.email}</p>
    <p><strong>Message:</strong> ${createNewsLetterDto.message || 'N/A'}</p>
    <p style="font-size: 12px; color: #888;">You can manage this subscriber in your admin panel.</p>
  </div>
  `;

    await Promise.all([
      this.mailService.sendMail({
        to: createNewsLetterDto.email,
        subject: 'Thanks for subscribing to our newsletter',
        html: userHtml,
      }),
      this.mailService.sendMail({
        to: 'dev.milonhossain32@gmail.com',
        subject: 'New Newsletter Subscription',
        html: adminHtml,
      }),
      this.prisma.news_letter.create({
        data: createNewsLetterDto,
      }),
    ]);

    return {
      message: 'Thanks for your message! We will reach out immediately.',
    };
  }

  async findAll() {
    const res = await this.prisma.news_letter.findMany();
    return res;
  }
}
