import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtGuard } from './common/guard/jwt.guard';
import { Prisma } from '@prisma/client';
import { RolesGuard } from './common/guard/roles.guard';
import { PrismaService } from './module/prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const public_dir=join(process.cwd(), 'public');
  // swager setup 
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
   app.use('/', express.static(public_dir));
  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);
  app.useGlobalGuards(new JwtGuard(reflector, prisma), new RolesGuard(reflector));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
