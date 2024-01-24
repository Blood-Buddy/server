import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { RegisterHospitalDto } from './dto/register.dto';
import { Hospital } from './schemas/hospital.schema';
import { AuthGuard } from '@nestjs/passport';
import { EditHospitalDto } from './dto/editHospital.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Post('register')
  async register(
    @Body() 
    registerDto: RegisterHospitalDto): Promise<Hospital> {
    return await this.hospitalService.create(registerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt-hospital'))
  async findHospital(@Req() req) {
    const hospital = this.hospitalService.findHospital(req.user);
    return hospital
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt-hospital'))
  async editProfile(
    @Param('id') id: string,
    @Body() hospital: EditHospitalDto
  ): Promise<Hospital> {
    return await this.hospitalService.editProfile(id, hospital);
  }
}
