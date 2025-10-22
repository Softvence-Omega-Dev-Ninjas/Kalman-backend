import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
    return this.commisionService.create(createCommisionDto);
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  get_commision_rate() {
    return this.commisionService.getCommisionRate();
  }
}
