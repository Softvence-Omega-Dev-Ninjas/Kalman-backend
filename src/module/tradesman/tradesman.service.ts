import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
// import { CreateTradesmanDto } from './dto/create-tradesman.dto';
// import { UpdateTradesmanDto } from './dto/update-tradesman.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { AppError } from 'src/error/AppError';

@Injectable()
export class TradesmanService {
  constructor(private prisma: PrismaService) {}
  async create(createTradesmanDto: CreateTradesManDto) {
    const { docs, businessDetail, serviceArea, paymentMethod, ...restData } =
      createTradesmanDto;

    try {
      const isUserExist = await this.prisma.tradesMan.findUnique({
        where: {
          email: restData?.email,
        },
      });

      if (isUserExist) {
        throw new HttpException('User already exist ', HttpStatus.BAD_REQUEST);
      }
      const tradesman = await this.prisma.tradesMan.create({
        data: {
          ...restData,
          docs: docs
            ? {
                create: {
                  type: docs.type,
                  url: docs.url,
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

  async findAll() {
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

  update(id: number, updateTradesmanDto: UpdateTradesManDto) {
    console.log({ updateTradesmanDto });
    return `This action updates a #${id} tradesman`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradesman`;
  }
}
