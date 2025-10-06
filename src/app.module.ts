// AppModule
import { Module } from '@nestjs/common';

import { PrismaModule } from './module/prisma/prisma.module';
import { SeederService } from './seed/seed.service';
import { TwilioModule } from './module/twilio/twilio.module';
import { MailModule } from './module/mail/mail.module';
import { TradesmanModule } from './module/tradesman/tradesman.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TwilioModule,
    MailModule,
    TradesmanModule,
  ],
  providers: [SeederService],
})
export class AppModule {}
