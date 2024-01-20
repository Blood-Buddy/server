import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { RequestModule } from './request/request.module';
import { AppointmentModule } from './appointment/appointment.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ".env",
    isGlobal: true
  }) , 
  MongooseModule.forRoot(process.env.DB_URI, {
    dbName: "BloodBuddy"
  }),
  AuthModule,
  HospitalModule,
  RequestModule,
  AppointmentModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
