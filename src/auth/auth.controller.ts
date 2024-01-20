import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { EditUserDto } from './dto/editProfile.dto';

@Controller('user')
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

  @Get()
  @UseGuards(AuthGuard())
  async findUser(@Req() req): Promise<User[]> {
    const users = this.authService.getProfile(req.user);
    return users
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
