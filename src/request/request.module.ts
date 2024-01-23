import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './schema/request.schema';
import { UserSchema } from 'src/auth/schemas/user.schema';
import {HospitalSchema} from "../hospital/schemas/hospital.schema";

@Module({
  imports: [AuthModule,
  MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema },{ name: 'Hospital', schema: HospitalSchema },{ name: 'User', schema: UserSchema }])],
  providers: [RequestService],
  controllers: [RequestController]
})
export class RequestModule {}
