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



async get_dashboard() {
  // Current date and last month's date
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Total counts (overall)
  const totalUser = await this.prisma.user.count();
  const totalCompletedJobs = await this.prisma.jobs.count({
    where: { isComplete: true },
  });

  // Counts for last month
  const lastMonthUserCount = await this.prisma.user.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const lastMonthJobCount = await this.prisma.jobs.count({
    where: {
      isComplete: true,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  // Counts for this month
  const thisMonthUserCount = await this.prisma.user.count({
    where: {
      createdAt: {
        gte: startOfThisMonth,
        lte: now,
      },
    },
  });

  const thisMonthJobCount = await this.prisma.jobs.count({
    where: {
      isComplete: true,
      createdAt: {
        gte: startOfThisMonth,
        lte: now,
      },
    },
  });

  // Calculate growth percentage safely
  const userGrowth =
    lastMonthUserCount === 0
      ? 100
      : ((thisMonthUserCount - lastMonthUserCount) / lastMonthUserCount) * 100;

  const jobGrowth =
    lastMonthJobCount === 0
      ? 100
      : ((thisMonthJobCount - lastMonthJobCount) / lastMonthJobCount) * 100;
  
      const totlaVerifiedTradesman=await this.prisma.tradesMan.count({
       where:{
        isVerified:true
       }
      })
      const totalJobs=await this.prisma.jobs.count()
      const jobCompilationRate=(totalCompletedJobs/totalJobs)*100
      
  return {
    totalUser,
    totalCompletedJobs,
    userGrowth: userGrowth.toFixed(2) + '%',
    jobGrowth: jobGrowth.toFixed(2) + '%',
    montlyRevenue:0,
    totalRevenue:0,
    totlaVerifiedTradesman,
    jobCompilationRatePercentage:jobCompilationRate.toFixed(2) +"%"
  };
}

async get_system_status(){
  const totalUser = await this.prisma.user.count({
    where:{
      createdAt:{
        gte:new Date(new Date().setDate(new Date().getDate() - 7))
      }
    }
  });
  return {
    lastSavenDayUser:totalUser
  }
}
}
