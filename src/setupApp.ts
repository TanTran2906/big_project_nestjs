// setupApp.ts

import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export function setupApp(app: any): void {
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
}
