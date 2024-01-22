import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { HospitalSchema } from 'src/hospital/schemas/hospital.schema';
import { HospitalService } from 'src/hospital/hospital.service';
import { JwtHospitalStrategy } from './jwtHospital.strategy';
import { CustomJwtAuthGuard } from 'src/guard/custom-auth.guard';
import { JwtUserStrategy } from './jwt-user.strategy';

@Module({
  imports: [PassportModule.register({defaultStrategy: "jwt"}),
    JwtModule.registerAsync({
        inject:[ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string | number>('JWT_EXPIRES_IN') }
        })
    }),
    MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
    MongooseModule.forFeature([{name: "Hospital", schema: HospitalSchema}])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, HospitalService, JwtHospitalStrategy, JwtUserStrategy],
  exports: [JwtStrategy, PassportModule, JwtHospitalStrategy, JwtUserStrategy]
})
export class AuthModule {}
