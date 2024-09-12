// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password }); // Tạo instance nhưng chưa lưu
    return await this.repo.save(user); // Lưu instance vào cơ sở dữ liệu
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attributes: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Người dùng không được tìm thấy');
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Người dùng không được tìm thấy');
    }
    await this.repo.remove(user);
  }
}
