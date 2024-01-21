import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "./schemas/user.schema";
import { RegisterUserDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { EditUserDto } from "./dto/editProfile.dto";
import { LoginHospitalDto } from "src/hospital/dto/login.dto";

@Controller("user")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(
    @Body()
    registerDto: RegisterUserDto
  ): Promise<User> {
    return await this.authService.create(registerDto);
  }

  @Post("login")
  async login(
    @Body()
    loginData: LoginDto | LoginHospitalDto
  ): Promise<{ access_token: string }> {
    try {
      return await this.authService.login(loginData as LoginDto);
    } catch (error) {
      try {
        return await this.authService.hospitalLogin(loginData as LoginHospitalDto);
      } catch (error) {
        throw new HttpException(
          "Invalid login credentials",
          HttpStatus.UNAUTHORIZED
        );
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async findUser(@Req() req): Promise<User[]> {
    const users = this.authService.getProfile(req.user);
    return users;
  }

  @Put(":id")
  @UseGuards(AuthGuard())
  async editProfile(
    @Param("id") id: string,
    @Body() user: EditUserDto
  ): Promise<User> {
    return await this.authService.editProfile(id, user);
  }
}
