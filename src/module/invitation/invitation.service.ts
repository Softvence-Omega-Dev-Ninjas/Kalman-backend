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
    const result = await this.prisma.invitation.create({
      data: {
        messgae: createInvitationDto?.message as string,
        tradesManId: createInvitationDto?.tradesManId as string,
        userId:userId,
        location:createInvitationDto?.location as string,
        title:createInvitationDto?.title as string,
        date:createInvitationDto?.date as string,
        time_slot:createInvitationDto?.time_slot as string
      },
    });
    return result;
  }

  async findAll() {
    const result = await this.prisma.invitation.findMany({
      include:{
        user:true
      }
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.invitation.findUnique({
      where: {
        id,
      },
      include:{
        user:true
      }
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
      include:{
        user:true
      }
    });
    return result;
  }
}
