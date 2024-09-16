import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDTO)) // Áp dụng Interceptor với UserDTO
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);

    // Gán userId vào đối tượng session
    session.userId = user.id;

    // Trả về đối tượng user
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);

    // Gán userId vào đối tượng session
    session.userId = user.id;
    console.log(session.userId);
    // Trả về đối tượng user
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  // @UseInterceptors(new SerializeInterceptor(UserDTO)) // Áp dụng Interceptor với UserDTO
  async findUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string): Promise<void> {
    const userId = parseInt(id, 10); // Chuyển đổi ID từ string sang number
    await this.usersService.delete(userId); // Gọi phương thức remove từ UsersService
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(parseInt(id), body);
  }
}
