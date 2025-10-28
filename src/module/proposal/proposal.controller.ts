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
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { Request } from 'express';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  // @Public()
  create(@Body() createProposalDto: CreateProposalDto, @Req() req: any) {
    try {
      return this.proposalService.create(createProposalDto, req.user);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get()
  findAll() {
    try {
      return this.proposalService.findAll();
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get('my-proposal')
  findProposal(@Req() req: any) {
    try {
      const user = req.user;
      return this.proposalService.companyProposal(user?.id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.proposalService.findOne(id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @Req() req: any,
  ) {
    try {
      console.log({ updateProposalDto });
      return this.proposalService.update(id, updateProposalDto, req.user);
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
      return this.proposalService.remove(+id);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Internal server error',
        error: error,
      };
    }
  }
}
