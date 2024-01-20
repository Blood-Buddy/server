import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: "Appointment", schema: AppointmentSchema }])
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
