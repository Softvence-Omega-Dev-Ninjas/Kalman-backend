import { Injectable } from '@nestjs/common';
import { CreateCommisionDto } from './dto/create-commision.dto';
import { UpdateCommisionDto } from './dto/update-commision.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommisionService {
  constructor(private prisma:PrismaService){}

 async create(createCommisionDto: CreateCommisionDto) {
  const comTable=await this.prisma.commision.findFirst()
  if(comTable){
      const res=await this.prisma.commision.update({
        where:{
          id:comTable.id
        },
        data:{
          commision_rate:createCommisionDto.commisssion_rate,
          maximum_hourly_rate:createCommisionDto.maximum_hourly_rate,
          minimum_hourly_rate:createCommisionDto.minimun_hourly_rate
        }
      })
      return res
    }
    const res=await this.prisma.commision.create({
      data:{
        commision_rate:createCommisionDto.commisssion_rate,
        maximum_hourly_rate:createCommisionDto.maximum_hourly_rate,
        minimum_hourly_rate:createCommisionDto.minimun_hourly_rate  
      }
    })
    return res
  }

  async getCommisionRate(){
    const res=await this.prisma.commision.findFirst()
    return res
  }
}
