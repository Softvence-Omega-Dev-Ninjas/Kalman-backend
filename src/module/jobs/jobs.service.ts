import { HttpException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';
import { GetJobsFilterDto } from './dto/getAllJobs';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async create(createJobDto: CreateJobDto, user: User, files: any) {
    // const userExist = await this.prisma.user.findFirst({
    //   where: {
    //     id: user.id,
    //   },
    // });
    // if(userExist?.verification==="PENDING"){
    //   throw new HttpException("Your account is not verified",400)
    // }
    const filePaths = files.map((file) => buildFileUrl(file.filename));
    const commisionRate = await this.prisma.commision.findFirst();
    const percentCalculetion = commisionRate?.commision_rate
      ? commisionRate.commision_rate / 100
      : 0;
    const commisionAmount = createJobDto.price * percentCalculetion;
    const res = await this.prisma.jobs.create({
      data: {
        title: createJobDto.title,
        categoryId: createJobDto.categoryId,
        description: createJobDto.description,
        location: createJobDto.location,
        timeline: createJobDto.timeline,
        preferred_date: createJobDto.preferred_date,
        preferred_time: createJobDto.preferred_time,
        image: filePaths,
        contact_method: createJobDto.contact_method,
        shortlist_fee: commisionAmount,
        skills_needed: createJobDto.skills_needed,
        userId: user.id,
        price: createJobDto.price,
        subCategories: createJobDto.subCategories,
      },
      include: {
        category: true,
      },
    });
    const job_id = res.id;
    const activity = await this.prisma.job_Activity.create({
      data: {
        jobId: job_id,
      },
    });
    return {
      res,
      activity,
    };
  }

  async findAll(filterDto: GetJobsFilterDto) {
    const {
      search,
      category,
      subCategory,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = filterDto;
    const take = limit;
    const skip = (page - 1) * limit;

    const where: any = {};

    // --- (Existing Filter Logic - Uses the 'where' object for all filters) ---
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { has: search } },
        { skills_needed: { has: search } },
      ];
    }
    if (category) {
      where.category = { has: category };
    }
    if (subCategory) {
      where.skills_needed = { has: subCategory };
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = minPrice;
      }
      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }
    const totalCount = await this.prisma.jobs.count({
      where,
    });

    // 3. Fetch the paginated jobs
    const jobs = await this.prisma.jobs.findMany({
      where,
      skip,
      take,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
          },
        },
        jobActivity: true,
      },
    });
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: jobs,
      meta: {
        total: totalCount,
        limit: limit,
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // --------------------------------find single product-------------------------------------------
  findOne(id: string) {
    const res = this.prisma.jobs.findFirst({
      where: {
        id: id,
      },
      include: {
        jobActivity:true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
            verification: true,
          },
        },
      },
    });
    return res;
  }

  async remove(id: string, user: any) {
    const isAdmin = user.role === 'ADMIN';
    const creatorCondition = {
      id: id,
      userId: user.id,
    };
    const whereCondition = isAdmin ? { id: id } : creatorCondition;
    const job = await this.prisma.jobs.findFirst({
      where: whereCondition,
    });

    if (!job) {
      throw new HttpException(
        'You are not authorized to delete this job or the job does not exist.',
        403,
      );
    }
    await this.prisma.jobs.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Job deleted successfully',
    };
  }


  async findUserJobs(user: any) {
    const res = await this.prisma.jobs.findMany({
      where: {
        userId: user.id,
      },
    });
    return res;
  }
}
