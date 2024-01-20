import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { EditUserDto } from './dto/editProfile.dto';

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

  @Get(":id")
  @UseGuards(AuthGuard())
  async findUser(@Param("id") id: string): Promise<User> {
    return await this.authService.findById(id);
  }

  @Put(":id")
@UseGuards(AuthGuard())
async editProfile(
  @Param("id") id: string,
  @Body() user: EditUserDto,
): Promise<User> {
  return await this.authService.editProfile(id, user);
}
}
