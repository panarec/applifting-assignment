import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));
  const config = new DocumentBuilder()
    .setTitle('Applifting assignement')
    .setDescription(
      `
    This OpenAPI specification describes APIs available in the Applifing Blog Engine application.

    Following APIs are exposed:

    - Authentication - This API is used for login and access token acquisition

    - Posts - This API is a CRUD over blog entries

    - Comments - This API is used for comment voting

    Authorization:

    Posts API is protected using the Access Token acquired from the "/login" EndPoint.
    Access Token MUST be sent like so "Authorization: my-access-token" in the HTTP header.`,
    )
    .setVersion('1.0')
    .addTag('applifting')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();
