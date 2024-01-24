import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RequestSchema } from 'src/request/schema/request.schema';
import { HospitalSchema } from 'src/hospital/schemas/hospital.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: "Appointment", schema: AppointmentSchema }]),
    MongooseModule.forFeature([{ name: "Request", schema: RequestSchema }]),
    MongooseModule.forFeature([{ name: "Hospital", schema: HospitalSchema }]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
