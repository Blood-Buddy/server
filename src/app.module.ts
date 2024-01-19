import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { RequestModule } from './request/request.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ".env",
    isGlobal: true
  }) , 
  MongooseModule.forRoot(process.env.DB_URI, {
    dbName: "BloodBuddy"
  }),
  BookModule,
  AuthModule,
  HospitalModule,
  RequestModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
