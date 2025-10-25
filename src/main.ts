import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { TransformInterceptor } from './common/interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './module/prisma/prisma.service';
import { JwtGuard } from './common/guard/jwt.guard';
import * as fs from 'fs';
import { MaintenanceGuard } from './common/guard/maintence.guard';
import appMetadata from './app-metadata/app-metadata';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files
  const public_dir = join(process.cwd(), 'public');
  const upload_dir = join(process.cwd(), 'uploads');
  app.use('/', express.static(public_dir));

  // setup upload foler if not exist
  if (!fs.existsSync(upload_dir)) {
    fs.mkdirSync(upload_dir, { recursive: true });
    console.log('Created uploads folder at', upload_dir);
  }
  app.use('/uploads', express.static(upload_dir));
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle(appMetadata.displayName)
    .setDescription(appMetadata.description)
    .setVersion(appMetadata.version)
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalInterceptors(new TransformInterceptor());
  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(
    new JwtGuard(reflector, prisma),
    // new MaintenanceGuard(prisma),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipUndefinedProperties: true,
    }),
  );
  // app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: ['*', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 6000);
}

bootstrap();
