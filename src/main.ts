import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Import thư viện cookie-session
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình cookie-session middleware
  app.use(
    cookieSession({
      name: 'session',
      keys: ['yourSecretKey'], // Thay thế bằng key bảo mật của bạn
      maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie (1 ngày)
      httpOnly: true, // Chỉ cho phép sử dụng trong HTTP (bảo mật)
      secure: process.env.NODE_ENV === 'production', // Đặt cookie secure trong môi trường production
    }),
  );

  // Sử dụng Validation Pipe với tùy chọn whitelist để loại bỏ các thuộc tính không xác thực
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
