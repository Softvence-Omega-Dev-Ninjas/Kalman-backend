import { Injectable } from '@nestjs/common';
// import { CreateTradesmanDto } from './dto/create-tradesman.dto';
// import { UpdateTradesmanDto } from './dto/update-tradesman.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
@Injectable()
export class TradesmanService {
  constructor(private prisma: PrismaService) {}
  create(createTradesmanDto: CreateTradesManDto) {
    return 'This action adds a new tradesman';
  }

  findAll() {
    return `This action returns all tradesman`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradesman`;
  }

  update(id: number, updateTradesmanDto: UpdateTradesManDto) {
    return `This action updates a #${id} tradesman`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradesman`;
  }
}
