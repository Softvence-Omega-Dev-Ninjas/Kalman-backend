import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './module/prisma/prisma.module';
import { MailModule } from './module/mail/mail.module';
import { PrismaService } from './module/prisma/prisma.service';
import { TwilioModule } from './module/twilio/twilio.module';
import { SeederService } from './seed/seed.service';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [PrismaModule, MailModule, TwilioModule, AuthModule],
  controllers: [AppController],
  providers: [AppService,PrismaService,SeederService],
})
export class AppModule {}
