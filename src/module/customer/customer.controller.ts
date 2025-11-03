import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileStorageOptions } from 'src/utils/index.multer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  find_all_jobs(@Req() req: any) {
    try {
      const user = req.user;
      return this.customerService.find_All_jobs_with_stat(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('get-me')
  get_me(@Req() req: any) {
    try {
      const user = req.user;
      return this.customerService.get_me(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Patch()
  @ApiOperation({
    summary: "Update the authenticated user's profile (excluding email)",
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('profile_image', 1, fileStorageOptions))
  @ApiBody({
    schema: {
      type: 'object',

      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        profession: { type: 'string' },
        bio: { type: 'string' },
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip_code: { type: 'string' },

        profile_image: {
          type: 'string',
          format: 'binary',
          description: 'Optional profile image file to upload/replace.',
        },
      },
    },
  })
  async update_profile(
    @Req() req: any,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const userId = req.user.id;

      return this.customerService.update_profile(
        userId,
        updateCustomerDto,
        files,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
