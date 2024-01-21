import { Module } from "@nestjs/common";
import { HospitalController } from "./hospital.controller";
import { HospitalService } from "./hospital.service";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalSchema } from "./schemas/hospital.schema";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: "Hospital", schema: HospitalSchema }]),
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
