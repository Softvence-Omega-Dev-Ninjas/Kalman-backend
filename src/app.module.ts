// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { join } from 'path';

import { PrismaModule } from './module/prisma/prisma.module';
import { SeederService } from './seed/seed.service';
import { TwilioModule } from './module/twilio/twilio.module';
import { MailModule } from './module/mail/mail.module';
import { TradesmanModule } from './module/tradesman/tradesman.module';
import { AuthModule } from './module/auth/auth.module';
import { JobsModule } from './module/jobs/jobs.module';
import { CustomerModule } from './module/customer/customer.module';
import { StripeModule } from './module/stripe/stripe.module';
import { AdminModule } from './module/admin/admin.module';
import { CommisionModule } from './module/commision/commision.module';
import { BlogModule } from './module/blog/blog.module';
import { NewsLetterModule } from './module/news-letter/news-letter.module';
import { ChatModule } from './module/chat/chat.module';
import { ReviewModule } from './module/review/review.module';
import { CategoryModule } from './module/category/category.module';
import { ProposalModule } from './module/proposal/proposal.module';
import { InvitationModule } from './module/invitation/invitation.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ResponseTimeMiddleware } from './common/interceptor/serverResponse.middlewere';


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
    BlogModule,
    NewsLetterModule,
    ChatModule,
    ReviewModule,
    CategoryModule,
    ProposalModule,
    InvitationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [SeederService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseTimeMiddleware)
      .forRoutes('*'); 
  }
}
