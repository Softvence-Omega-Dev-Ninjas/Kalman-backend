// AppModule
import { Module } from '@nestjs/common';

import { PrismaModule } from './module/prisma/prisma.module';
import { SeederService } from './seed/seed.service';
import { TwilioModule } from './module/twilio/twilio.module';
import { MailModule } from './module/mail/mail.module';
import { TradesmanModule } from './module/tradesman/tradesman.module';
import { AuthModule } from './module/auth/auth.module';
import { JobsModule } from './module/jobs/jobs.module';
import { CustomerModule } from './module/customer/customer.module';
// import { StripeModule } from './stripe/stripe.module';
import { StripeModule } from './module/stripe/stripe.module';
import { AdminModule } from './module/admin/admin.module';
import { CommisionModule } from './module/commision/commision.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TwilioModule,
    MailModule,
    TradesmanModule,
    JobsModule,
    CustomerModule,
    StripeModule,
    AdminModule,
    CommisionModule,
  ],
  providers: [SeederService],
})
export class AppModule {}
