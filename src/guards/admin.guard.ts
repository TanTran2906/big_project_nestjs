// admin.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Kiểm tra nếu người dùng đã đăng nhập
    if (!request.currentUser) {
      console.log(request.currentUser);
      return false;
    }

    console.log(request.currentUser.admin);
    // Kiểm tra nếu người dùng là admin
    return request.currentUser.admin;
  }
}
