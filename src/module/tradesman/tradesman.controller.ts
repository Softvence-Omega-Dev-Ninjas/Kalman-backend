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
} from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
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

    // Combine doc and background files into a single array
    const allFiles: Express.Multer.File[] = [
      ...(files.doc ?? []),
      ...(files.credential ?? []),
    ];

    return this.tradesmanService.create(createTradesmanDto, allFiles);
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
    name: 'skip',
    required: false,
    type: String,
    description: 'Number of records to skip (for pagination)',
    example: '0',
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
  findAll(
    @Query()
    query: {
      limit: string;
      skip: string;
      search: string;
      category: string;
    },
  ) {
    return this.tradesmanService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tradesmanService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Tradesman ID to update',
    required: true,
    example: 'clw2x2sh0000y1x9k3v1t1u2f',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'doc', maxCount: 1 },
      { name: 'credential', maxCount: 1 },
    ]),
  )
  @ApiBody({
    description: 'Update tradesman fields selectively with file uploads',
    schema: {
      type: 'object',
      properties: {
        doc: { type: 'string', format: 'binary' },
        credential: { type: 'string', format: 'binary' },
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        phoneNumber: { type: 'string', nullable: true },
        dateOfBirth: { type: 'string', format: 'date', nullable: true },
        address: { type: 'string', nullable: true },
        city: { type: 'string', nullable: true },
        state: { type: 'string', nullable: true },
        zipCode: { type: 'number', nullable: true },
        docs: {
          type: 'object',
          properties: {
            type: { type: 'string', nullable: true },
          },
          nullable: true,
        },
        businessDetail: {
          type: 'object',
          properties: {
            businessName: { type: 'string', nullable: true },
            yearsOfExperience: { type: 'number', nullable: true },
            businessType: { type: 'string', nullable: true },
            hourlyRate: { type: 'string', nullable: true },
            services: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
            },
            professionalDescription: { type: 'string', nullable: true },
          },
          nullable: true,
        },
        serviceArea: {
          type: 'object',
          properties: {
            address: { type: 'string', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            radius: { type: 'number', nullable: true },
          },
          nullable: true,
        },
        paymentMethod: {
          type: 'object',
          properties: {
            methodType: { type: 'string', nullable: true },
            provider: { type: 'string', nullable: true },
            cardHolderName: { type: 'string', nullable: true },
            cardNumber: { type: 'string', nullable: true },
            expiryDate: { type: 'string', nullable: true },
            cvv: { type: 'string', nullable: true },
            saveCard: { type: 'boolean', nullable: true },
            streetAddress: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            postCode: { type: 'string', nullable: true },
            agreedToTerms: { type: 'boolean', nullable: true },
          },
          nullable: true,
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      doc?: Express.Multer.File[];
      credential?: Express.Multer.File[];
    },
    @Body() updateTradesmanDto: UpdateTradesManDto,
  ) {
    // ✅ Clean the DTO before passing to service
    const cleanData = this.removeEmptyFields(updateTradesmanDto);

    return this.tradesmanService.update(id, cleanData, files);
  }

  /**
   * Remove null, undefined, and empty fields recursively
   */
  private removeEmptyFields(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    const cleaned: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      const value = obj[key];
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(
          typeof value === 'object' &&
          Object.keys(this.removeEmptyFields(value)).length === 0
        )
      ) {
        cleaned[key] = this.removeEmptyFields(value);
      }
    }
    return cleaned;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradesmanService.remove(+id);
  }
}
