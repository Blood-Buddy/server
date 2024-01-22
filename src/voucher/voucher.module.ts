import { Module } from "@nestjs/common";
import { VoucherController } from "./voucher.controller";
import { VoucherService } from "./voucher.service";
import { MongooseModule } from "@nestjs/mongoose";
import { VoucherSchema } from "./schemas/voucher.schema";
import { AuthModule } from "src/auth/auth.module";
import {VoucherTransactionSchema} from "./schemas/vouchertransaction.schema";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: "Voucher", schema: VoucherSchema },{ name: "VoucherTransaction", schema: VoucherTransactionSchema }]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
