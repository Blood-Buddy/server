import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    registerDto: RegisterUserDto,
  ): Promise<User> {
    return await this.authService.create(registerDto);
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ): Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }
}
