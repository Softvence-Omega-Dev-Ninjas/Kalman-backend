import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { StripeService } from '../stripe/stripe.service';
import { saveFileAndGetUrl } from 'src/utils/saveFileAndGetUrl';
@Injectable()
export class TradesmanService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async create(
    createTradesmanDto: CreateTradesManDto,
    files: Express.Multer.File[],
  ) {
    const { docs, businessDetail, serviceArea, paymentMethod, ...restData } =
      createTradesmanDto;
    try {
      if (!files?.find((el) => el.fieldname === 'doc')!) {
        throw new HttpException(
          'Upload your document first',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          email: createTradesmanDto?.email,
        },
      });
      if (!isUserExist) {
        throw new HttpException(
          'No account found. Register first ',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isTradesManExist = await this.prisma.tradesMan.findUnique({
        where: {
          email: createTradesmanDto?.email,
        },
      });
      if (isTradesManExist) {
        throw new HttpException(
          'This email is already used',
          HttpStatus.BAD_REQUEST,
        );
      }

      const doc = await saveFileAndGetUrl(
        files?.find((el) => el.fieldname === 'doc')!,
      );
      if (files?.find((el) => el.fieldname === 'credential')!) {
        restData.professionalQualifications = await saveFileAndGetUrl(
          files?.find((el) => el.fieldname === 'credential')!,
        );
      }

      const stripeCustomer = await this.stripeService.createCustomer(
        restData?.email,
        restData?.firstName + ' ' + restData?.lastName,
      );

      const stripeConnect = await this.stripeService.createConnectedAccount(
        restData?.email,
      );

      // 9️⃣ Generate Stripe login link for Express account verification
      // const loginLink = await this.stripeService.createLoginLink(
      //   stripeConnect.id,
      // );

      // console.log({ stripeConnect, loginLink });

      restData.zipCode = Number(restData?.zipCode);
      delete restData.credential;
      const tradesman = await this.prisma.tradesMan.create({
        data: {
          ...restData,
          userId: isUserExist?.id,

          stripeCustomerId: stripeCustomer?.id,
          stripeConnectId: stripeConnect.id,
          // images: undefined,
          docs: docs
            ? {
                create: {
                  type: docs.type,
                  url: doc,
                },
              }
            : undefined,

          businessDetail: businessDetail
            ? {
                create: {
                  businessName: businessDetail.businessName,
                  yearsOfExperience: businessDetail.yearsOfExperience,
                  businessType: businessDetail.businessType,
                  hourlyRate: businessDetail.hourlyRate,
                  services: businessDetail.services,
                  professionalDescription:
                    businessDetail.professionalDescription,
                },
              }
            : undefined,

          serviceArea: serviceArea
            ? {
                create: {
                  address: serviceArea.address,
                  latitude: serviceArea.latitude,
                  longitude: serviceArea.longitude,
                  radius: serviceArea.radius,
                },
              }
            : undefined,

          paymentMethod: paymentMethod
            ? {
                create: {
                  methodType: paymentMethod.methodType,
                  provider: paymentMethod.provider,
                  cardHolderName: paymentMethod.cardHolderName,
                  cardNumber: paymentMethod.cardNumber,
                  expiryDate: paymentMethod.expiryDate,
                  cvv: paymentMethod.cvv,
                  saveCard: paymentMethod.saveCard,
                  streetAddress: paymentMethod.streetAddress,
                  city: paymentMethod.city,
                  postCode: paymentMethod.postCode,
                  agreedToTerms: paymentMethod.agreedToTerms,
                },
              }
            : undefined,
        },
        include: {
          docs: true,
          businessDetail: true,
          serviceArea: true,
          paymentMethod: true,
        },
      });

      return {
        success: true,
        message: 'Tradesman created successfully',
        data: tradesman,
      };
    } catch (error) {
      console.error({ error });
      throw new BadRequestException(
        error?.response || 'Failed to create tradesman',
      );
    }
  }

  async getOverView(id: string) {
    const tradesman = await this.prisma.tradesMan.findUnique({
      where: { userId: id },
    });

    if (!tradesman) throw new Error('Tradesman not found');

    const tradesManId = tradesman.id;

    // 📅 Define time periods
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 🧾 Fetch my accepted proposals
    const myShortlist = await this.prisma.proposal.findMany({
      where: {
        tradesManId,
        status: 'ACCEPTED',
      },
      include: {
        user: true,
        jobs: true,
      },
    });

    // 🕒 Fetch recent accepted proposals
    const recentShortlist = await this.prisma.proposal.findMany({
      where: { status: 'ACCEPTED' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        jobs: true,
        user: true,
      },
    });

    // 📊 === ACTIVITY (All proposals created by this tradesman) ===
    const [activityMonth, activity6Month, activityYear] = await Promise.all([
      this.prisma.proposal.count({
        where: {
          tradesManId,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.proposal.count({
        where: {
          tradesManId,
          createdAt: { gte: sixMonthsAgo },
        },
      }),
      this.prisma.proposal.count({
        where: {
          tradesManId,
          createdAt: { gte: startOfYear },
        },
      }),
    ]);

    // ✅ === COMPLETED JOBS (Jobs where isComplete = true) ===
    const [completedMonth, completed6Month, completedYear] = await Promise.all([
      this.prisma.jobs.count({
        where: {
          isComplete: true,
          updatedAt: { gte: startOfMonth },
          proposal: { some: { tradesManId } },
        },
      }),
      this.prisma.jobs.count({
        where: {
          isComplete: true,
          updatedAt: { gte: sixMonthsAgo },
          proposal: { some: { tradesManId } },
        },
      }),
      this.prisma.jobs.count({
        where: {
          isComplete: true,
          updatedAt: { gte: startOfYear },
          proposal: { some: { tradesManId } },
        },
      }),
    ]);

    // ⭐ === SHORTLISTED (Accepted proposals) ===
    const [shortlistedMonth, shortlisted6Month, shortlistedYear] =
      await Promise.all([
        this.prisma.proposal.count({
          where: {
            tradesManId,
            status: 'ACCEPTED',
            createdAt: { gte: startOfMonth },
          },
        }),
        this.prisma.proposal.count({
          where: {
            tradesManId,
            status: 'ACCEPTED',
            createdAt: { gte: sixMonthsAgo },
          },
        }),
        this.prisma.proposal.count({
          where: {
            tradesManId,
            status: 'ACCEPTED',
            createdAt: { gte: startOfYear },
          },
        }),
      ]);

    return {
      myShortlist,
      recentShortlist,
      stats: {
        activity: {
          month: activityMonth,
          sixMonths: activity6Month,
          year: activityYear,
        },
        completed: {
          month: completedMonth,
          sixMonths: completed6Month,
          year: completedYear,
        },
        shortlisted: {
          month: shortlistedMonth,
          sixMonths: shortlisted6Month,
          year: shortlistedYear,
        },
      },
    };
  }

  async findAll(query: Record<string, unknown>) {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query?.page ? Number(query?.page) : 1;
    const skip = (page - 1) * limit;
    const search = query.search ? String(query.search) : '';
    const category = query.category ? String(query.category) : '';

    const filters: any[] = [];
    if (search) {
      filters.push({
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          // { profession: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }
    if (category) {
      filters.push({
        // profession: query.category, // adjust as needed
      });
    }
    const totalItem = await this.prisma.tradesMan.count({
      where: { AND: filters },
    });
    const result = await this.prisma.tradesMan.findMany({
      where: {
        AND: filters,
      },
      include: {
        docs: true,
        businessDetail: true,
        serviceArea: true,
        paymentMethod: true,
      },
      take: limit,
      skip,
    });
    return {
      data: result,
      metadata: {
        limit,
        page,
        totalPages: Math.ceil(totalItem / limit),
        totalItem,
      },
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.tradesMan.findUnique({
      where: {
        id,
      },
      include: {
        docs: true,
        businessDetail: true,
        serviceArea: true,
        paymentMethod: true,
      },
    });
    if (!result) {
      throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async update(
    id: string,
    updateTradesmanDto: UpdateTradesManDto,
    files?: { images: Express.Multer.File[] },
  ) {
    // let arr: string[] = [];
    const data: {
      images?: string[];
      phoneNumber?: string;
      email?: string;
      firstName?: string;
      profession?: string;
      bio?: string;
      city?: string;
      state?: string;
      zipCode?: number;
      street?: string;
    } = {};
    console.log({ files });
    let imagesLinks = [];
    data.images = imagesLinks;
    data.phoneNumber = updateTradesmanDto?.phone;
    ((data.email = updateTradesmanDto?.email),
      (data.firstName = updateTradesmanDto?.fullName));
    data.profession = updateTradesmanDto?.profession;
    data.bio = updateTradesmanDto?.bio;
    data.city = updateTradesmanDto?.city;
    data.state = updateTradesmanDto?.state;
    data.zipCode = updateTradesmanDto?.zipCode;
    data.street = updateTradesmanDto?.street;
    if (files?.images) {
      const arr = await Promise.all(
        files.images.map(async (el) => {
          return await saveFileAndGetUrl(el);
        }),
      );
      data.images = arr;
      console.log({ arr });
    }
    const result = await this.prisma.tradesMan.update({
      where: {
        userId: id,
      },
      data,
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} tradesman`;
  }
}
