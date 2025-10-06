import { Injectable } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
 constructor(private prisma:PrismaService){}

  async find_All_jobs_with_stat(user:User) {
    const userId = user.id;
    const startOfCurrentMonth = new Date(new Date().setDate(1));
    
    const [jobs,jobOfThisMonth,sortListedThisMonth]=await Promise.all([
        this.prisma.jobs.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    this.prisma.jobs.count({
      where:{
        createdAt:{
          gte:startOfCurrentMonth
        },
        userId:userId
      }
    }),
    this.prisma.jobShortlist.count({
      where:{
        createdAt:{
          gte:startOfCurrentMonth
        },
        customerId:userId
      }
    })
    ])

    return{
      totalJobs:jobs.length,
      jobOfThisMonth,
      sortListedThisMonth,
      jobs
    };
  }

 async get_me(user:User) {
    const userId=user.id;
    
    const [activeJobs,profile,totalJobs]=await Promise.all([
      this.prisma.jobs.count({
        where:{
          userId:userId,
          isComplete:false
        }
      }),
     this.prisma.user.findFirst({
      where:{
        id:userId
      }
    }),
    this.prisma.jobs.count({
      where:{
        userId:userId
      }
    })
    ])
    return{
      activeJobs,
      completeJobs:totalJobs-activeJobs,
       profile,
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
