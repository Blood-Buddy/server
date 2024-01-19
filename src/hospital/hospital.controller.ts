import { Body, Controller, Post } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { RegisterHospitalDto } from './dto/register.dto';
import { Hospital } from './schemas/hospital.schema';
import { LoginHospitalDto } from './dto/login.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Post('register')
  async register(
    @Body() 
    registerDto: RegisterHospitalDto): Promise<Hospital> {
    return await this.hospitalService.create(registerDto);
  }
  @Post("login")
  async login(
    @Body()
    loginDto: LoginHospitalDto,
  ): Promise<{ token: string }> {
    return await this.hospitalService.login(loginDto);
  }
}
