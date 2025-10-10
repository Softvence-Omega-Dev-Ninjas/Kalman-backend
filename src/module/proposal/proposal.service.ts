import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}
  async create(createProposalDto: CreateProposalDto) {
    const result = await this.prisma.proposal.create({
      data: createProposalDto,
    });
    return result;
  }

  async findAll() {
    const result = this.prisma.proposal.findMany({
      include: {
        user: true,
        jobs: true,
      },
    });
    return result;
  }

  findOne(id: string) {
    const result = this.prisma.proposal.findUnique({
      where: {
        id,
      },
    });
    if (!result) {
      throw new HttpException('No proposal found', HttpStatus.NOT_FOUND);
    }
  }

  update(id: string, updateProposalDto: UpdateProposalDto) {
    return `This action updates a #${id} proposal`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposal`;
  }
}
