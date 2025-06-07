import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow any domain
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
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
