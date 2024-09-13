import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service'; // Đường dẫn tới tệp users.service.ts
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Chuyển đổi hàm scrypt thành hàm trả về promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // Phương thức đăng ký người dùng mới
  async signUp(email: string, password: string) {
    // 1. Kiểm tra xem email đã được sử dụng chưa
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email đã được sử dụng.');
    }

    // 2. Mã hóa mật khẩu người dùng
    // 2.1. Tạo muối
    const salt = randomBytes(8).toString('hex');
    // Ví dụ: '4b340366b9c7e7e5'

    // 2.2. Băm mật khẩu cùng với muối
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Ví dụ: Buffer <89 36 47 54 b4 c7 08 ...> (Buffer dạng nhị phân)

    // 2.3. Kết hợp muối và kết quả băm
    const result = salt + '.' + hash.toString('hex');
    // Ví dụ: '4b340366b9c7e7e5.89264754b4c7080b3d08d735d0cf7a7b0f8fce19b6164ab812a8c5cf2a4d276d'

    //Tạo user và save
    const user = await this.usersService.create(email, result);

    return user;
  }

  async signIn(email: string, password: string) {
    // Tìm kiếm người dùng theo email
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Tách salt và hash từ mật khẩu đã lưu
    const [salt, storedHash] = user.password.split('.');

    // Hash mật khẩu được cung cấp cùng với salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // So sánh hash mới với hash đã lưu
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    return user;
  }
}
