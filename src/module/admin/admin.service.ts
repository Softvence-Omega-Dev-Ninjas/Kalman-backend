import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllUserDto } from './dto/getAllUser.dto';

@Injectable()
export class AdminService {
constructor(private readonly prisma: PrismaService) {}

  async find_all_users(filterDto: GetAllUserDto) {
    const { page=1, limit=10 } = filterDto;
    const skip = (page - 1) * limit;
    const take = limit;
    const users = await this.prisma.user.findMany({
     take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include:{
          _count:{
             select:{
              jobs:true
             }
          }
      }
    });
    return users;
  }

  async user_details(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return user;
  }



  remove(id:string) {
    const res = this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return{
      status:200,
      message:"User deleted successfully",
    }
  }





  async find_all_jobs(filterDto: GetAllUserDto) {
    const { page=1, limit=10 } = filterDto;
    const skip = (page - 1) * limit;
    const take = limit;
    const jobs = await this.prisma.jobs.findMany({
     take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
     
    });
    return jobs;
  }

  async job_details(id: string) {
    const job = await this.prisma.jobs.findFirst({
      where: {
        id: id,
      },
    });
    return job;
  }



  async remove_job(id:string) {
    const res = await this.prisma.jobs.delete({
      where: {
        id: id,
      },
    });
    return{
      status:200,
      message:"User deleted successfully",
    }
  }
}
