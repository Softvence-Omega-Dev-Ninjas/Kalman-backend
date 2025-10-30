import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllUserDto } from './dto/getAllUser.dto';
import { SystemActivityDto } from './dto/system_activity.dto';
import { contains } from 'class-validator';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // find all user by admin
  async find_all_users(filterDto: GetAllUserDto) {
    const { page = 1, limit = 10,search } = filterDto;
    const skip = (page - 1) * limit;
    const take = limit;
    const where:any={}
    if(search){
      where.OR=[
        {name:{contains:search,mode:"insensitive"}}
        ,{email:{contains:search,mode:"insensitive"}}
        ,{phone:{contains:search,mode:"insensitive"}}
      ]
    }
    const totalUser=await this.prisma.user.count()
    const users = await this.prisma.user.findMany({
      where,
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });
    return{
      totalUser:totalUser,
      users:users
    };
  }

  // admin can see the single user details
  async user_details(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return user;
  }

  // admin can remore any user from his platform
  remove(id: string) {
    const res = this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }

  // find all jobs by admin
  async find_all_jobs(filterDto: GetAllUserDto) {
    const { page = 1, limit = 10,search } = filterDto;
    const skip = (page - 1) * limit;
    const take = limit;
    const where:any={}
     if(search){
      where.OR=[
        {title:{contains:search,mode:"insensitive"}},
        {description:{contains:search,mode:"insensitive"}},
      ]
    }
    const totalJobs=await this.prisma.jobs.count()
    const jobs = await this.prisma.jobs.findMany({
      where,
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include:{
        customer:{
          select:{
            name:true,
            email:true,
            profile_image:true,
            verification:true,
            createdAt:true
          }
        }
      }
    });
    return{
      totalJobs:totalJobs,
      jobs:jobs
    };
  }

  // admin can see single job details
  async job_details(id: string) {
    const job = await this.prisma.jobs.findFirst({
      where: {
        id: id,
      },
    });
    return job;
  }

  // admin can remove any job from his platfrom
  async remove_job(id: string) {
    const res = await this.prisma.jobs.delete({
      where: {
        id: id,
      },
    });
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }

  // get all dashboard stats
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

    const totalRevenueLastMonth = await this.prisma.payment.count({
      where: {
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

    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalRevenueThisMonth = await this.prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: startOfThisMonth,
          lte: now,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const revenueGrowth =
      totalRevenueLastMonth === 0
        ? 100
        : ((totalRevenueThisMonth._sum.amount! - totalRevenueLastMonth) /
            totalRevenueLastMonth) *
          100;
    // Calculate growth percentage safely
    const userGrowth =
      lastMonthUserCount === 0
        ? 100
        : ((thisMonthUserCount - lastMonthUserCount) / lastMonthUserCount) *
          100;

    const jobGrowth =
      lastMonthJobCount === 0
        ? 100
        : ((thisMonthJobCount - lastMonthJobCount) / lastMonthJobCount) * 100;

    const totlaVerifiedTradesman = await this.prisma.tradesMan.count({
      where: {
        isVerified: true,
      },
    });
    const totalJobs = await this.prisma.jobs.count();
    const jobCompilationRate = (totalCompletedJobs / totalJobs) * 100;
    const avg_ratting = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    return {
      totalUser,
      totalCompletedJobs,
      userGrowth: userGrowth.toFixed(2) + '%',
      jobGrowth: jobGrowth.toFixed(2) + '%',
      montlyRevenue: totalRevenueThisMonth._sum.amount,
      revenueGrowth: revenueGrowth.toFixed(2) + '%',
      totalRevenue: totalRevenue._sum.amount,
      totlaVerifiedTradesman,
      jobCompilationRatePercentage: jobCompilationRate.toFixed(2) + '%',
      avg_ratting: avg_ratting._avg.rating,
    };
  }

  // get system status
  async get_system_status() {
    const totalUser = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });
    const totalJobs = await this.prisma.jobs.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    });

    const lastJobCompleted = await this.prisma.jobs.findFirst({
      where: {
        isComplete: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      lastSavenDayUser: totalUser,
      lastOneDayTotalJobs: totalJobs,
      lastJobCompleted: lastJobCompleted,
    };
  }

  // set the system activity of this platfomr
  async set_system_activity(systemActivity: SystemActivityDto) {
    const activity_table = await this.prisma.admin_activity.findFirst();
    if (activity_table) {
      const res = await this.prisma.admin_activity.update({
        where: {
          id: activity_table.id,
        },
        data: {
          maximum_attempt: systemActivity.maximum_attempt,
          session_timeout: systemActivity.session_timeout,
          maintenance_mode: systemActivity.maintenance_mode,
          new_registration: systemActivity.new_registration,
        },
      });
      return res;
    } else {
      const res = await this.prisma.admin_activity.create({
        data: {
          maximum_attempt: systemActivity.maximum_attempt,
          session_timeout: systemActivity.session_timeout,
          maintenance_mode: systemActivity.maintenance_mode,
          new_registration: systemActivity.new_registration,
        },
      });
      return res;
    }
  }

  // get payments history of this platfrom
  async get_all_payments() {
    const payments = await this.prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tradesMan: true,
        job: true,
      },
    });
    return payments;
  }

  // get plaftform performence
  async get_platfrom_performence() {
    const [totalJobs, totalTradesMan, AllShortList, reviews, totalUser] =
      await Promise.all([
        this.prisma.jobs.count(),
        this.prisma.proposal.count(),
        this.prisma.proposal.count({
          where: {
            status: 'ACCEPTED',
          },
        }),
        this.prisma.review.count({
          where: {
            rating: {
              gte: 3,
            },
          },
        }),
        this.prisma.user.count(),
      ]);
    const aplicationRate = (totalTradesMan / totalJobs) * 100;
    const shortListRate = (AllShortList / totalJobs) * 100;
    const satisfiedCustomerRate = (reviews / totalUser) * 100;
    return {
      aplicationRate: aplicationRate.toFixed(2) + '%',
      shortListRate: shortListRate.toFixed(2) + '%',
      satisfiedCustomer: satisfiedCustomerRate.toFixed(2) + '%',
    };
  }

  // get top category service with job percentage for every product
  async get_top_category_service() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });
    const totalJobs = categories.reduce((sum, cat) => sum + cat._count.jobs, 0);

    const categoriesWithPercentage = categories.map((cat) => {
      const percentage =
        totalJobs > 0 ? (cat._count.jobs / totalJobs) * 100 : 0;
      return {
        catgoreName: cat.name,
        jobPercentage: parseFloat(percentage.toFixed(2)),
      };
    });

    return categoriesWithPercentage;
  }




  async get_systemActivity() {
    const activity_table = await this.prisma.admin_activity.findFirst();
    return activity_table;
  }
}
