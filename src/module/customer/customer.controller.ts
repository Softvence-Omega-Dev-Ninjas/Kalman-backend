import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}


  @Get()
  find_all_jobs(@Req() req:any) {
    const user = req.user;
    return this.customerService.find_All_jobs_with_stat(user);
  }

  @Get('get-me')
  get_me(@Req() req:any) {
    const user=req.user
    return this.customerService.get_me(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
