import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  create(@Body() createInvitationDto: CreateInvitationDto,@Req() req:any) {
    const user=req.user
    console.log(user)
    return this.invitationService.create(createInvitationDto,user.id);
  }

  @Get()
  findAll() {
    return this.invitationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
  ) {
    return this.invitationService.update(id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationService.remove(id);
  }

  @Get('get-tradman-invitation')
  async getInvitationByUserId(@Req() req: any) {
    const user = req.user;
    return this.invitationService.getInvitationByUserId(user.id);
  }
}
