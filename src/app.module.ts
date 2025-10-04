// AppModule
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guard/jwt.guard';
import { RolesGuard } from './common/guard/roles.guard';
import { Reflector } from '@nestjs/core';
import { PrismaService } from './module/prisma/prisma.service';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { SeederService } from './seed/seed.service';
import { TwilioModule } from './module/twilio/twilio.module';
import { MailModule } from './module/mail/mail.module';

@Module({
  imports: [AuthModule, PrismaModule, TwilioModule, MailModule],
  providers: [SeederService],
})
export class AppModule {}
