import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FeaturesSeeder } from './modules/features/features.seeder';
import { CoinSeeder } from './modules/coins/coins.seeder';
import { useContainer } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const featuresSeeder = app.get(FeaturesSeeder);
  await featuresSeeder.seed();
  const coinsSeeder = app.get(CoinSeeder);
  await coinsSeeder.seed();
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('nestjs-swagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
