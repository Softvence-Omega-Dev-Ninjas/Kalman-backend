import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
  Req,
} from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
// import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CreateTradesManDto } from './dto/test.dto';
import { CreatePaymentMethodDto } from './dto/payment-method.dto';
import { GetTradesmanFilterDto } from './dto/tradesman-query-dto-';
@Controller('tradesman')
export class TradesmanController {
  constructor(private readonly tradesmanService: TradesmanService) {}

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'doc', maxCount: 1 },
      { name: 'credential', maxCount: 1 },
    ]),
  )
  @ApiBody({
    description: 'Create tradesman with file uploads',
    schema: {
      type: 'object',
      properties: {
        doc: { type: 'string', format: 'binary' },
        credential: { type: 'string', format: 'binary' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        categoryId: { type: 'string' },
        subCategories: { type: 'array' },
        email: { type: 'string' },
        phoneNumber: { type: 'string' },
        dateOfBirth: { type: 'string', format: 'date-time' },
        address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipCode: { type: 'number' },
        docs: {
          type: 'object',
          properties: {
            type: { type: 'string' },
          },
        },
        // ProfessionalQualifications: { type: 'string' },

        // 👇 Nested objects (will come as JSON strings)
        businessDetail: {
          type: 'object',
          properties: {
            businessName: { type: 'string' },
            yearsOfExperience: { type: 'number' },
            businessType: { type: 'string' },
            hourlyRate: { type: 'string' },
            services: { type: 'array', items: { type: 'string' } },
            professionalDescription: { type: 'string' },
          },
        },
        serviceArea: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            radius: { type: 'number' },
          },
        },
        paymentMethod: {
          type: 'object',
          properties: {
            methodType: { type: 'string' },
            provider: { type: 'string' },
            cardHolderName: { type: 'string' },
            cardNumber: { type: 'string' },
            expiryDate: { type: 'string' },
            cvv: { type: 'string' },
            saveCard: { type: 'boolean' },
            streetAddress: { type: 'string' },
            city: { type: 'string' },
            postCode: { type: 'string' },
            agreedToTerms: { type: 'boolean' },
          },
        },
      },
    },
  })
  async create(
    @UploadedFiles()
    files: {
      doc?: Express.Multer.File[];
      credential?: Express.Multer.File[];
    },
    @Body() createTradesmanDto: any,
  ) {
    try {
      const parseJSONField = (field: string) => {
        try {
          return field ? JSON.parse(field) : undefined;
        } catch (err) {
          console.warn(`Failed to parse ${field}:`, err);
          return undefined;
        }
      };

      createTradesmanDto.businessDetail = parseJSONField(
        createTradesmanDto.businessDetail,
      );
      createTradesmanDto.docs = parseJSONField(createTradesmanDto.docs);
      createTradesmanDto.serviceArea = parseJSONField(
        createTradesmanDto.serviceArea,
      );
      createTradesmanDto.paymentMethod = parseJSONField(
        createTradesmanDto.paymentMethod,
      );

      createTradesmanDto.subCategories = Array.isArray(
        createTradesmanDto.subCategories,
      )
        ? createTradesmanDto.subCategories
        : createTradesmanDto.subCategories
          ? createTradesmanDto.subCategories
              .split(',')
              .map((v: string) => v.trim())
          : [];
      // Combine doc and background files into a single array
      const allFiles: Express.Multer.File[] = [
        ...(files.doc ?? []),
        ...(files.credential ?? []),
      ];

      return this.tradesmanService.create(createTradesmanDto, allFiles);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }
  @Get()
  @Public()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of records to return per page',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Number of records to skip (for pagination)',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search tradesmen by name, email, or any related field',
    example: 'John',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter tradesmen by category',
    example: 'Electrician',
  })
  async findAll(
    @Query()
    query: GetTradesmanFilterDto,
  ) {
    try {
      // console.log({ query });
      return this.tradesmanService.findAll(query);
    } catch (error) {
      console.log({ error });
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get('overview')
  async getOverview(@Req() req: any) {
    try {
      const user = req.user;
      console.log({ user });
      const result = await this.tradesmanService.getOverView(user?.id);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }
  @Get('profile')
  profile(@Req() req: any) {
    try {
      const user = req.user;

      return this.tradesmanService.getTradesManProfile(user?.id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get('history')
  history(@Req() req: any) {
    try {
      const user = req.user;

      return this.tradesmanService.getHistory(user?.id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    try {
      return this.tradesmanService.findOne(id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Patch('update-tradesman')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  update(
    @Req() req: any,
    @Body() updateTradesmanDto: UpdateTradesManDto,
    @UploadedFiles()
    files?: { images: Express.Multer.File[] },
  ) {
    try {
      const user = req.user;
      console.log(user);
      return this.tradesmanService.update(user?.id, updateTradesmanDto, files);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Patch('update-tradesman')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  addPaymentMothod(
    @Req() req: any,
    @Body() updateTradesmanDto: UpdateTradesManDto,
    @UploadedFiles()
    files?: { images: Express.Multer.File[] },
  ) {
    try {
      const user = req.user;
      console.log(user);
      return this.tradesmanService.update(user?.id, updateTradesmanDto, files);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.tradesmanService.remove(+id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Patch('add-payment')
  addPayment(@Body() dto: CreatePaymentMethodDto, @Req() req: any) {
    const user = req.user;
    return this.tradesmanService.addPaymentMethod(user?.id, dto);
  }

  @Patch('remove-payment/:paymentId')
  removePayment(@Req() req: any, @Param('paymentId') paymentId: string) {
    const user = req.user;
    return this.tradesmanService.removePaymentMethod(paymentId);
  }

  @Patch('set-default-payment/:paymentId')
  setDefaultPayment(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.tradesmanService.setPaymentMethodDefault(paymentId);
  }

  @Patch('add-money')
  addMoney(@Req() req: any) {
    try {
      const user = req.user;

      return this.tradesmanService.addBalance(user?.id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }
}
