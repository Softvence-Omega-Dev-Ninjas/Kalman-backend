import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';
import { GetJobsFilterDto } from './dto/getAllJobs';

@Injectable()
export class JobsService {
  constructor(private prisma:PrismaService){}
 async create(createJobDto: CreateJobDto,user:User,files:any) {
   const filePaths = files.map(file =>buildFileUrl(file.filename));

   const res=await this.prisma.jobs.create({
      data:{
        title:createJobDto.title,
        category:createJobDto.category,
        description:createJobDto.description,
        location:createJobDto.location,
        timeline:createJobDto.timeline,
        preferred_date:createJobDto.preferred_date,
        preferred_time:createJobDto.preferred_time,
        image:filePaths,
        contact_method:createJobDto.contact_method,
        shortlist_fee:createJobDto.shortlist_fee,
        skills_needed:createJobDto.skills_needed,
        userId:user.id
      }
    })
   const job_id=res.id
   const activity=await this.prisma.job_Activity.create({
    data:{
      jobId:job_id
    }
   })
   return{
    res,
    activity
   }
  }

 async findAll(filterDto: GetJobsFilterDto) {
    const { search, category, subCategory, location, minPrice, maxPrice } = filterDto;

    const where: any = {};

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
     
      where.shortlist_fee = {}; 
      if (minPrice) {
        where.price.gte = minPrice;
      }
      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }
    const jobs = await this.prisma.jobs.findMany({ 
      where,
    });

    return jobs;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
