import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}
  async create(createProposalDto: CreateProposalDto) {
    const isJobExist = await this.prisma.jobs.findUnique({
      where: {
        id: createProposalDto?.jobId,
      },
    });
    if (!isJobExist || !isJobExist.userId) {
      throw new HttpException(
        'Job not found or userId missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isUserAlreadyAplied = await this.prisma.proposal.findFirst({
      where: {
        jobId: createProposalDto?.jobId,
        tradesManId: createProposalDto?.tradesManId,
      },
    });

    if (isUserAlreadyAplied) {
      throw new HttpException(
        'Already applied for this job post',
        HttpStatus.CONFLICT,
      );
    }
    // 1. check if the trandsman have money?

    const result = await this.prisma.proposal.create({
      data: {
        ...createProposalDto,
        userId: isJobExist.userId,
      },
    });
    return result;
  }

  async findAll() {
    const result = await this.prisma.proposal.findMany({
      include: {
        user: true,
        jobs: true,
        tradesMan: true,
      },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.proposal.findUnique({
      where: {
        id,
      },
      include: {
        jobs: true,
        user: true,
        tradesMan: true,
      },
    });
    console.log({ result });
    if (!result) {
      throw new HttpException('No proposal found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async update(id: string, updateProposalDto: UpdateProposalDto) {
    const isProposalExist = await this.prisma.proposal.findUnique({
      where: {
        id,
      },
    });
    if (!isProposalExist) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    if (updateProposalDto?.status === 'ACCEPTED') {
      // handle money transfwer
    }
    const result = await this.prisma.proposal.update({
      where: {
        id,
      },
      data: {
        status: updateProposalDto?.status || isProposalExist.status,
        tradesMan: updateProposalDto?.tradesManId
          ? { connect: { id: updateProposalDto.tradesManId } }
          : undefined,
      },
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} proposal`;
  }
}
