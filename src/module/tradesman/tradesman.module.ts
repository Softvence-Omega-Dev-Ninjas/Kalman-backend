import { Module } from '@nestjs/common';
import { TradesmanService } from './tradesman.service';
import { TradesmanController } from './tradesman.controller';
import { StripeModule } from '../stripe/stripe.module';
@Module({
  imports: [StripeModule],
  controllers: [TradesmanController],
  providers: [TradesmanService],
})
export class TradesmanModule {}
