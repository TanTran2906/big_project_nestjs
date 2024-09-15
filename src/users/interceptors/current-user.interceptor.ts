import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    // Lấy đối tượng request từ context
    const request = context.switchToHttp().getRequest();

    // Lấy userId từ session
    const { userId } = request.session || {};

    // Kiểm tra nếu có userId, tìm user từ database
    if (userId) {
      const user = await this.usersService.findOne(userId);
      // Gắn user tìm được vào request để sử dụng trong các decorator khác
      request.currentUser = user;
    }

    // Tiếp tục thực thi handler của route
    return handler.handle();
  }
}
