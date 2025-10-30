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
import { GetTradesmanFilterDto } from './dto/tradesman-query-dto-';
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
    console.log({ restData });
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

  async findAll(query: GetTradesmanFilterDto) {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query?.page ? Number(query?.page) : 1;
    const category = query?.category;
    const subCategory = query?.subCategory;
    const location = query?.location;
    // const rating = query?.rating;
    const skip = (page - 1) * limit;
    const search = query.search;

    const where: any = {};
    console.log({ query });
    // Search filter
    if (search) {
      where.OR = [
        // { cardHolderName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },

        { lastName: { contains: search, mode: 'insensitive' } },

        // { cardNumber: { contains: search, mode: 'insensitive' } },
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
      where.OR = [
        { address: { contains: location, mode: 'insensitive' } },
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
      ];
    }

    // if (rating && Array.isArray(rating) && rating.length > 0) {
    //   where.review = {
    //     some: {
    //       rating: {
    //         in: rating.map(Number),
    //       },
    //     },
    //   };
    // }

    console.log({ where });
    const result = await this.prisma.tradesMan.findMany({
      where,
      include: {
        docs: true,
        businessDetail: true,
        serviceArea: true,
        paymentMethod: true,
        category: {
          select: {
            name: true,
            subCategories: true,
          },
        },
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
    const total = await this.prisma.tradesMan.findMany({
      where,
    });
    return {
      data: result,
      metadata: {
        limit,
        page,
        totalPages: Math.ceil(total?.length / limit),
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
    const isTradesManExist = await this.prisma.tradesMan.findFirst({
      where: {
        userId: id,
      },
    });
    if (!isTradesManExist) {
      throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
    }
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
    console.log(files);
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
      data: { ...data },
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
        payments: {
          include: {
            job: {
              select: {
                title: true,
              },
            },
          },
        },
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
    const isCardNumberExist = await this.prisma.paymentMethod.findFirst({
      where: {
        cardNumber: dto?.cardNumber,
      },
    });
    if (isCardNumberExist) {
      throw new HttpException(
        'Card number already exist',
        HttpStatus.BAD_REQUEST,
      );
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
      return { res1, res2 };
    });
    const onboardingUrl = await this.stripeService.createOnboardingLink(
      isTradesManExist?.stripeConnectId,
    );

    return {
      success: true,
      message: 'Payment method added successfully',
      data: {
        onboardingUrl,
      },
    };
  }

  async removePaymentMethod(id: string) {
    const isPaymentMethodExist = await this.prisma.paymentMethod.findFirst({
      where: { id },
    });
    if (!isPaymentMethodExist) {
      throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
    }
    if (isPaymentMethodExist.isDefault) {
      throw new HttpException(
        'Payment method is default',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.prisma.paymentMethod.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'payment method deleted sucessfully',
      data: result,
    };
  }

  async setPaymentMethodDefault(id: string) {
    const isPaymentMethodExist = await this.prisma.paymentMethod.findFirst({
      where: { id },
    });
    if (!isPaymentMethodExist) {
      throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
    }
    if (isPaymentMethodExist?.isDefault) {
      throw new HttpException(
        'Payment already is default state',
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.prisma.$transaction(async (tx) => {
      const res1 = await tx.paymentMethod.updateMany({
        where: { userId: isPaymentMethodExist?.userId, isDefault: true },
        data: { isDefault: false },
      });
      const res2 = await tx.paymentMethod.update({
        where: { id },
        data: {
          isDefault: true,
        },
      });
      return { res1, res2 };
    });
    return {
      success: true,
      messgae: 'Payment method is set to default',
      data: res.res2,
    };
  }
}
