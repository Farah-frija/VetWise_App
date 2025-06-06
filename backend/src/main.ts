import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow any domain
   
  });
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
