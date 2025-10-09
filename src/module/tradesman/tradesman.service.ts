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

      restData.zipCode = Number(restData?.zipCode);
      delete restData.credential;
      const tradesman = await this.prisma.tradesMan.create({
        data: {
          ...restData,
          userId: isUserExist?.id,

          stripeCustomerId: stripeCustomer?.id,
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
    updateTradesmanDto: any,
    files?: Express.Multer.File[],
  ) {
    const { docs, businessDetail, serviceArea, paymentMethod, ...restData } =
      updateTradesmanDto;
    console.log({ updateTradesmanDto });
    try {
      // Check if the tradesman exists
      const existingTradesman = await this.prisma.tradesMan.findUnique({
        where: { id },
        include: {
          docs: true,
          businessDetail: true,
          serviceArea: true,
          paymentMethod: true,
        },
      });

      if (!existingTradesman) {
        throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
      }

      // --- Handle file updates ---
      let docUrl = existingTradesman.docs?.url;
      if (files?.find((el) => el.fieldname === 'doc')) {
        docUrl = await saveFileAndGetUrl(
          files.find((el) => el.fieldname === 'doc')!,
        );
      }

      if (files?.find((el) => el.fieldname === 'credential')) {
        restData.professionalQualifications = await saveFileAndGetUrl(
          files.find((el) => el.fieldname === 'credential')!,
        );
      }

      restData.zipCode = Number(restData?.zipCode);
      delete restData.credential;

      // --- Update tradesman with nested relations ---
      const updatedTradesman = await this.prisma.tradesMan.update({
        where: { id },
        data: {
          ...restData,

          docs: docs
            ? {
                upsert: {
                  create: {
                    type: docs.type,
                    url: docUrl,
                  },
                  update: {
                    type: docs.type,
                    url: docUrl,
                  },
                },
              }
            : undefined,

          businessDetail: businessDetail
            ? {
                upsert: {
                  create: {
                    businessName: businessDetail.businessName,
                    yearsOfExperience: businessDetail.yearsOfExperience,
                    businessType: businessDetail.businessType,
                    hourlyRate: businessDetail.hourlyRate,
                    services: businessDetail.services,
                    professionalDescription:
                      businessDetail.professionalDescription,
                  },
                  update: {
                    businessName: businessDetail.businessName,
                    yearsOfExperience: businessDetail.yearsOfExperience,
                    businessType: businessDetail.businessType,
                    hourlyRate: businessDetail.hourlyRate,
                    services: businessDetail.services,
                    professionalDescription:
                      businessDetail.professionalDescription,
                  },
                },
              }
            : undefined,

          serviceArea: serviceArea
            ? {
                upsert: {
                  create: {
                    address: serviceArea.address,
                    latitude: serviceArea.latitude,
                    longitude: serviceArea.longitude,
                    radius: serviceArea.radius,
                  },
                  update: {
                    address: serviceArea.address,
                    latitude: serviceArea.latitude,
                    longitude: serviceArea.longitude,
                    radius: serviceArea.radius,
                  },
                },
              }
            : undefined,

          paymentMethod: paymentMethod
            ? {
                upsert: {
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
                  update: {
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
        message: 'Tradesman updated successfully',
        data: updatedTradesman,
      };
    } catch (error) {
      console.error({ error });
      throw new BadRequestException(
        error?.response || 'Failed to update tradesman',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} tradesman`;
  }
}
