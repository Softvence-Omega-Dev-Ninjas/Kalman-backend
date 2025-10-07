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
    console.log({ query });
    const result = await this.prisma.tradesMan.findMany({
      include: {
        docs: true,
        businessDetail: true,
        serviceArea: true,
        paymentMethod: true,
      },
    });
    return result;
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
    return result;
  }

  update(
    id: string,
    updateTradesmanDto: UpdateTradesManDto,
    files: {
      doc?: Express.Multer.File[] | undefined;
      credential?: Express.Multer.File[];
    },
  ) {
    console.log({ updateTradesmanDto });
    return `This action updates a #${id} tradesman`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradesman`;
  }
}
