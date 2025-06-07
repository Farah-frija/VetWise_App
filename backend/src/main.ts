import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow any domain
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('VetWise API')
    .setDescription('The VetWise API documentation')
    .setVersion('1.0')
    .addBearerAuth() // If you're using JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Access it at /api-docs
  await app.listen(3001);
}
bootstrap();
