import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService) {}

  async create(createInvitationDto: CreateInvitationDto, userId: string) {
    const isAlreadyInvite = await this.prisma.invitation.findFirst({
      where: {
        tradesManId: createInvitationDto?.tradesManId,
      },
    });
    if (isAlreadyInvite) {
      throw new HttpException(
        'You have already invite this person for this job',
        HttpStatus.CONFLICT,
      );
    }
    const res = await this.prisma.$transaction(async (tx) => {
      await tx.proposal.create({
        data: {
          description: createInvitationDto?.message,
          jobId: createInvitationDto?.jobId,
          tradesManId: createInvitationDto?.tradesManId,
          userId: userId,
        },
      });
      const invitation = await tx.invitation.create({
        data: {
          messgae: createInvitationDto?.message,
          tradesManId: createInvitationDto?.tradesManId,
          userId: userId,
          location: createInvitationDto?.location,
          title: createInvitationDto?.title,
          date: createInvitationDto?.date,
          jobId: createInvitationDto?.jobId,
          time_slot: createInvitationDto?.time_slot,
        },
      });
      return invitation;
    });
    return {
      success: true,
      message: 'Invitation send successfully',
      data: res,
    };
  }

  async findAll() {
    const result = await this.prisma.invitation.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.invitation.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    return result;
  }

  update(id: string, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  async remove(id: string) {
    const result = await this.prisma.invitation.delete({
      where: {
        id,
      },
    });
    return result;
  }

  async getInvitationByUserId(userId: string) {
    const result = await this.prisma.invitation.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
    return result;
  }
}
