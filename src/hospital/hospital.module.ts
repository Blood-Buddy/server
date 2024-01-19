import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalSchema } from './schemas/hospital.schema';
import { JwtStrategy } from './jwtHospital.strategy';

@Module({
  imports: [PassportModule.register({defaultStrategy: "jwt"}),
    JwtModule.registerAsync({
        inject:[ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string | number>('JWT_EXPIRES_IN') }
        })
    }),
  MongooseModule.forFeature([{name: "Hospital", schema: HospitalSchema}])],
  controllers: [HospitalController],
  providers: [HospitalService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class HospitalModule {}
