import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from './schemas/hospital.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
  MongooseModule.forFeature([{name: "Hospital", schema: HospitalSchema}]),
  AuthModule],
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
