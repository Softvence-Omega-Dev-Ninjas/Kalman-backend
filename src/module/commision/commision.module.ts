import { Module } from '@nestjs/common';
import { CommisionService } from './commision.service';
import { CommisionController } from './commision.controller';

@Module({
  controllers: [CommisionController],
  providers: [CommisionService],
})
export class CommisionModule {}
