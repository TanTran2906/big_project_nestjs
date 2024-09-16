// auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing'; // Import TestingModule từ NestJS
import { AuthService } from './auth.service'; // Import AuthService
import { UsersService } from './users.service'; // Import UsersService
import { User } from './user.entity'; // Import User entity
import { BadRequestException } from '@nestjs/common'; // Import BadRequestException

describe('AuthService', () => {
  let authService: AuthService; // Tạo biến lưu AuthService
  let fakeUsersService: Partial<UsersService>; // Tạo biến lưu phiên bản giả của UsersService

  beforeEach(async () => {
    // Khởi tạo phiên bản giả của UsersService với các phương thức cần thiết
    fakeUsersService = {
      find: jest.fn().mockResolvedValue([]), // Hàm `find` trả về một mảng rỗng
      create: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User), // Hàm `create` giả
    };

    // Tạo một module test sử dụng TestingModule
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, // Cung cấp AuthService
        {
          provide: UsersService, // Cung cấp phiên bản giả của UsersService
          useValue: fakeUsersService, // Sử dụng fakeUsersService thay thế cho UsersService
        },
      ],
    }).compile();

    // Lấy instance của AuthService từ module
    authService = module.get<AuthService>(AuthService);
  });

  // Test để đảm bảo AuthService được khởi tạo thành công
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // Test để kiểm tra việc tạo người dùng mới với mật khẩu được mã hóa và salted
  it('creates a new user with a salted and hashed password', async () => {
    const email = 'newuser@example.com';
    const password = 'password123';

    // Mô phỏng hàm create trả về người dùng mới
    fakeUsersService.create = jest.fn().mockResolvedValue({
      id: 1,
      email,
      password: 'salted.hashedpassword', // Giả lập mật khẩu đã mã hóa
    } as User);

    // Gọi phương thức signUp
    const user = await authService.signUp(email, password);

    // Kiểm tra xem người dùng có được tạo thành công không
    expect(user).toBeDefined();
    expect(user.email).toEqual(email);

    // Kiểm tra rằng mật khẩu đã được mã hóa và salt hóa
    expect(user.password).not.toEqual(password); // Mật khẩu không được giống với mật khẩu đầu vào
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // Test để kiểm tra khi người dùng đăng ký với email đã tồn tại
  it('throws an error if user signs up with an email that is already in use', async () => {
    // Mô phỏng hàm find trả về người dùng đã tồn tại với email đó
    fakeUsersService.find = jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'newuser@example.com',
        password: 'hashedPassword',
      } as User,
    ]);

    // Kiểm tra rằng phương thức signUp sẽ ném BadRequestException khi email đã được sử dụng
    await expect(
      authService.signUp('newuser@example.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });
});
