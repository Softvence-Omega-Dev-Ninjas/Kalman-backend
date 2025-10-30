import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GetAllUserDto } from './dto/getAllUser.dto';
import { SystemActivityDto } from './dto/system_activity.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dasboard')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  get_dasboard() {
    return this.adminService.get_dashboard();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find all users of this platform' })
  find_all_users(@Query() filterDto: GetAllUserDto) {
    return this.adminService.find_all_users(filterDto);
  }

  @Get('customer:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  view_user_details(@Param('id') id: string) {
    return this.adminService.user_details(id);
  }

  @Delete('customer:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @Get('jobs')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find all users of this platform' })
  find_all_jobs(@Query() filterDto: GetAllUserDto) {
    return this.adminService.find_all_jobs(filterDto);
  }

  @Get('jobs:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  view_job_details(@Param('id') id: string) {
    return this.adminService.job_details(id);
  }

  @Delete('jobs:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove_jobs(@Param('id') id: string) {
    return this.adminService.remove_job(id);
  }

  @Get('system-status')
  async get_system_status() {
    return this.adminService.get_system_status();
  }

  @Post('system-activity')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Set system activity If it exist already then it will update',
  })
  @ApiBody({ type: SystemActivityDto })
  async set_system_activity(@Body() system_activity_dto: SystemActivityDto) {
    return this.adminService.set_system_activity(system_activity_dto);
  }

  @Get('system-activity')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async get_system_activity() {
    return this.adminService.get_systemActivity();
  }

  @Get('all-paymets')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async get_all_payments() {
    return this.adminService.get_all_payments();
  }

  @Get('platfrom-performence')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async get_platfrom_performence() {
    return this.adminService.get_platfrom_performence();
  }

  @Get('top-category-service')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async get_top_category_service() {
    return this.adminService.get_top_category_service();
  }
}
