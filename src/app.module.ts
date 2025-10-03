import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './module/prisma/prisma.module';
import { MailModule } from './module/mail/mail.module';
import { PrismaService } from './module/prisma/prisma.service';
import { TwilioModule } from './module/twilio/twilio.module';

@Module({
  imports: [PrismaModule, MailModule, TwilioModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
