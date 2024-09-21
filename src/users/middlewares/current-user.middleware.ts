// current-user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service'; // Import UsersService
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User; // Thuộc tính currentUser có thể là một instance của User hoặc undefined
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {}; // Lấy userId từ session

    if (userId) {
      const user = await this.usersService.findOne(userId); // Tìm người dùng theo ID
      req.currentUser = user; // Gán người dùng hiện tại vào req
    }

    next(); // Chuyển sang middleware tiếp theo
  }
}
