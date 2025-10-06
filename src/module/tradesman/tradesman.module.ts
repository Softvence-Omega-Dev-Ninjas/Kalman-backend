import { Module } from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
import { TradesmanController } from './tradesman.controller';

@Module({
  controllers: [TradesmanController],
  providers: [TradesmanService],
})
export class TradesmanModule {}
