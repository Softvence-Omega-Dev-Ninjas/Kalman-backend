import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';


@Module({
  controllers: [],
  providers: [TwilioService],
})
export class TwilioModule {}
