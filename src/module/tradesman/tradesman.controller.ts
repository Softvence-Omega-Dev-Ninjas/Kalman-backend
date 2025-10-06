import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
// import { CreateTradesmanDto } from './dto/create-tradesman.dto';
// import { UpdateTradesmanDto } from './dto/update-tradesman.dto';

@Controller('tradesman')
export class TradesmanController {
  constructor(private readonly tradesmanService: TradesmanService) {}

  @Post()
  create(@Body() createTradesmanDto: CreateTradesManDto) {
    return this.tradesmanService.create(createTradesmanDto);
  }

  @Get()
  findAll() {
    return this.tradesmanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradesmanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTradesmanDto: UpdateTradesManDto,
  ) {
    return this.tradesmanService.update(+id, updateTradesmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradesmanService.remove(+id);
  }
}
