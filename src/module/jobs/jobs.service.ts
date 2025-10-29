import { HttpException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';
import { GetJobsFilterDto } from './dto/getAllJobs';
import { equal } from 'assert';
import { equals } from 'class-validator';

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
    console.log(createJobDto)
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
        price: Number(createJobDto.price),
        subCategories: createJobDto.subCategories,
        budge_type: createJobDto.budget_type,
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

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Category filter
  if (category?.length) {
    where.categoryId = { in: category };
  }

  // SubCategory filter
  if (subCategory?.length) {
    // Match at least one of the given subcategories
    where.subCategories = { hasSome: subCategory };
  }

  // Location filter
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  // Price filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  // Count total matching jobs
  const totalCount = await this.prisma.jobs.count({ where });

  // Fetch jobs with pagination and relations
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
          createdAt: true,
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
      limit,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

  // --------------------------------find single product-------------------------------------------
  findOne(id: string) {
    if(!id){
      throw new HttpException("Job id is required", 400)
    }
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
            createdAt:true
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
    if(!user.id){
      throw new HttpException("User id is required", 400)
    }
    const res = await this.prisma.jobs.findMany({
      where: {
        userId: user.id,
      },
    });
    return res;
  }
}
