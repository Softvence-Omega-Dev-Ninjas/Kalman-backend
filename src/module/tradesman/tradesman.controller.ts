import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
import { CreateTradesManDto } from './dto/create-tradesman.dto';
import { UpdateTradesManDto } from './dto/update-tradesman.dto';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('tradesman')
export class TradesmanController {
  constructor(private readonly tradesmanService: TradesmanService) {}

  @Post()
  @Public()
  async create(@Body(ValidationPipe) createTradesmanDto: CreateTradesManDto) {
    return this.tradesmanService.create(createTradesmanDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.tradesmanService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tradesmanService.findOne(id);
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
