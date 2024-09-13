import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Import thư viện cookie-session
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình cookie-session
  app.use(
    cookieSession({
      name: 'session', // Tên của cookie lưu session
      keys: ['your-secret-key'], // Khóa bảo mật để mã hóa cookie
      maxAge: 24 * 60 * 60 * 1000, // Thời gian hết hạn của cookie (1 ngày)
    }),
  );

  // Sử dụng Validation Pipe với tùy chọn whitelist để loại bỏ các thuộc tính không xác thực
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
