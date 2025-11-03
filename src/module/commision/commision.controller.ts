import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { CommisionService } from './commision.service';
import { CreateCommisionDto } from './dto/create-commision.dto';
import { UpdateCommisionDto } from './dto/update-commision.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guard/roles.guard';

@Controller('commision')
export class CommisionController {
  constructor(private readonly commisionService: CommisionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateCommisionDto })
  create_commision_rate(@Body() createCommisionDto: CreateCommisionDto) {
    try {
      return this.commisionService.create(createCommisionDto);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  get_commision_rate() {
    try {
      return this.commisionService.getCommisionRate();
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
