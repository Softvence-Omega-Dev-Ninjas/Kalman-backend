import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
// import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { StripeService } from '../stripe/stripe.service';
import { saveFileAndGetUrl } from 'src/utils/saveFileAndGetUrl';
import { CreateTradesManDto } from './dto/test.dto';
import { saveFile } from 'src/utils/saveFiles';
import { CreatePaymentMethodDto } from './dto/payment-method.dto';
@Injectable()
export class TradesmanService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private stripe: StripeService,
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
      const isCategoryExist = await this.prisma.category.findUnique({
        where: {
          id: restData?.categoryId,
        },
      });
      console.log({ isCategoryExist });
      if (!isCategoryExist) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
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

      // const stripeCustomer = await this.stripeService.createCustomer(
      //   restData?.email,
      //   restData?.firstName + ' ' + restData?.lastName,
      // );

      const stripeConnect = await this.stripeService.createConnectedAccount(
        restData?.email,
      );

      const onboardingUrl = await this.stripeService.createOnboardingLink(
        stripeConnect.id,
      );

      restData.zipCode = Number(restData?.zipCode);
      delete restData.credential;
      const tradesman = await this.prisma.tradesMan.create({
        data: {
          ...restData,
          userId: isUserExist?.id,
          stripeConnectId: stripeConnect.id,

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
                create: [
                  {
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
                    isDefault: true,
                  },
                ],
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
        data: {
          tradesman,
          onboardingUrl,
        },
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

    const myShortlist = await this.prisma.proposal.findMany({
      where: {
        tradesManId,
        status: 'ACCEPTED',
      },
      include: {
        user: true,
        jobs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const participate = await this.prisma.proposal.count({
      where: { tradesManId },
    });

    const recentShortlist = await this.prisma.proposal.findMany({
      where: { status: 'ACCEPTED' },
      orderBy: { createdAt: 'desc' },
      include: {
        jobs: true,
        user: true,
      },
    });
    const invitations = await this.prisma.invitation.findMany({
      where: {
        tradesManId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      myShortlist,
      recentShortlist,
      participate,
      invitations,
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
        review: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
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
        review: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    console.log({ result });
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
    const data: {
      images?: string[];
      phoneNumber?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      profession?: string;
      bio?: string;
      city?: string;
      state?: string;
      zipCode?: number;
      street?: string;
    } = {};
    let imagesLinks = [];
    console.log({ id });
    data.images = imagesLinks;
    data.phoneNumber = updateTradesmanDto?.phone;
    ((data.email = updateTradesmanDto?.email),
      (data.firstName = updateTradesmanDto?.firstName));
    data.lastName = updateTradesmanDto?.lastName;
    data.profession = updateTradesmanDto?.profession;
    data.bio = updateTradesmanDto?.bio;
    data.city = updateTradesmanDto?.city;
    data.state = updateTradesmanDto?.state;
    data.zipCode = updateTradesmanDto?.zipCode;
    data.street = updateTradesmanDto?.street;
    if (files?.images) {
      const arr = await Promise.all(
        files.images.map(async (el) => {
          return await saveFile(el);
        }),
      );
      data.images = arr.map((el) => el.url);
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

  async getTradesManProfile(id: string) {
    console.log({ id });

    const result = await this.prisma.tradesMan.findFirst({
      where: {
        userId: id,
      },
      include: {
        docs: true,
        businessDetail: true,
        serviceArea: true,
        paymentMethod: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        payments: true,
        review: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Profile data retrived successfully',
      data: result,
    };
  }

  async getHistory(id: string) {
    const result = await this.prisma.payment.findFirst({
      where: {
        tradesManId: id,
      },
      orderBy: {
        createdAt: 'desc', // or whatever timestamp field you have
      },
    });
    return {
      success: true,
      message: 'History retrived successfully',
      data: result,
    };
  }

  async addBalance(id: string) {
    const isTradesManExist = await this.prisma.tradesMan.findFirst({
      where: { userId: id },
    });
    const addBalance = await this.stripe.addBalance(
      isTradesManExist?.stripeConnectId as string,
    );
    console.log({ addBalance });
    return {
      success: true,
      message: 'Balance added successfully',
      data: addBalance,
    };
  }
  async addPaymentMethod(id: string, dto: CreatePaymentMethodDto) {
    const isTradesManExist = await this.prisma.tradesMan.findFirst({
      where: { userId: id },
    });
    if (!isTradesManExist) {
      throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
    }

    const res = await this.prisma.$transaction(async (tx) => {
      const res1 = await tx.paymentMethod.updateMany({
        where: { userId: isTradesManExist.id, isDefault: true },
        data: { isDefault: false },
      });
      const res2 = await tx.paymentMethod.create({
        data: {
          ...dto,
          isDefault: true,
          userId: isTradesManExist.id,
        },
      });
      console.log({ res1, res2 });
    });

    return {
      success: true,
      message: 'Payment method added successfully',
      data: res,
    };
  }
}
