import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupApp } from './setupApp';
import { ConfigService } from '@nestjs/config';

// Import thư viện cookie-session
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Lấy ConfigService từ Nest
  setupApp(app, configService); // Truyền configService vào hàm setupApp
  await app.listen(3000);
}
bootstrap();
