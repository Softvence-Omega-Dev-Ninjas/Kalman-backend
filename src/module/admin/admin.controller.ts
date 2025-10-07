import { Controller, Get, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation } from '@nestjs/swagger';

import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GetAllUserDto } from './dto/getAllUser.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
}
