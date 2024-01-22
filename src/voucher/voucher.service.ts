import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Voucher } from "./schemas/voucher.schema";
import * as mongoose from "mongoose";
import { RegisterHospitalDto } from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import {VoucherTransaction} from "./schemas/vouchertransaction.schema";

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private voucherModel: mongoose.Model<Voucher>,
    @InjectModel(VoucherTransaction.name)
    private voucherTransactionModel: mongoose.Model<VoucherTransaction>
  ) {}

  async getAllVouchers() {
    const data = await this.voucherModel.find();
    if (!data) {
      throw new NotFoundException("Voucher is empty");
    }
    return data;
  }

  async getMyVouchers(email: string) {
    const myVouchers = await this.voucherTransactionModel.find({ email });
    if (!myVouchers) {
      throw new NotFoundException("My Vouchers not Found");
    }
    return myVouchers;
  }

}
