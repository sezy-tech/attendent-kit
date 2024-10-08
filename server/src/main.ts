import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip out properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw errors if any non-whitelisted properties are provided
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.use('/ai', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('Push Notification')
  .setDescription(
    'The API details of the business solution for the Push Notification Demo Application.',
  )
  .setVersion('1.0')
  .addTag('Notification')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
