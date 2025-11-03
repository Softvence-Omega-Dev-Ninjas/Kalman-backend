import { HttpException, Injectable } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async find_All_jobs_with_stat(user: User) {
    const userId = user.id;
    if (!userId) {
      throw new HttpException('UserId is required', 404);
    }

    const startOfCurrentMonth = new Date(new Date().setDate(1));

    const [jobs, jobOfThisMonth, sortListedThisMonth] = await Promise.all([
      this.prisma.jobs.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.jobs.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
          userId: userId,
        },
      }),
      this.prisma.jobShortlist.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
          customerId: userId,
        },
      }),
    ]);

    return {
      totalJobs: jobs.length,
      jobOfThisMonth,
      sortListedThisMonth,
      jobs,
    };
  }

  async get_me(user: User) {
    const userId = user.id;
    if (!userId) {
      throw new HttpException('You have to login first', 404);
    }
    const [activeJobs, profile, totalJobs] = await Promise.all([
      this.prisma.jobs.count({
        where: {
          userId: userId,
          isComplete: false,
        },
      }),
      this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      }),
      this.prisma.jobs.count({
        where: {
          userId: userId,
        },
      }),
    ]);
    return {
      activeJobs,
      completeJobs: totalJobs - activeJobs,
      profile,
    };
  }

  async update_profile(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    files,
  ) {
    if (!id) {
      throw new HttpException(
        'you have login first then you can update you profile',
        404,
      );
    }
    const filePath = files.map((file) => buildFileUrl(file.filename));
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...updateCustomerDto,
        profile_image: filePath[0],
      },
    });
  }
}
