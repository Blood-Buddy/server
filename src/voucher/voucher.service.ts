import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Voucher} from "./schemas/voucher.schema";
import * as mongoose from "mongoose";
import {RegisterHospitalDto} from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import {VoucherTransaction} from "./schemas/vouchertransaction.schema";
import {Schema, Types} from "mongoose";
import ObjectId = Types.ObjectId;

@Injectable()
export class VoucherService {
    constructor(
        @InjectModel(Voucher.name)
        private voucherModel: mongoose.Model<Voucher>,
        @InjectModel(VoucherTransaction.name)
        private voucherTransactionModel: mongoose.Model<VoucherTransaction>
    ) {
    }

    async getAllVouchers() {
        const data = await this.voucherModel.find();
        if (!data) {
            throw new NotFoundException("Voucher is empty");
        }
        return data;
    }

    async getMyVouchers(user: any) {
        const myVouchers = await this.voucherTransactionModel.aggregate([
            {
                '$match': {
                    'userId': new ObjectId(user._id)
                }
            }, {
                '$lookup': {
                    'from': 'vouchers',
                    'localField': 'voucherId',
                    'foreignField': '_id',
                    'as': 'voucher'
                }
            }, {
                '$unwind': {
                    'path': '$voucher'
                }
            }
        ]);



        if (!myVouchers) {
            throw new NotFoundException("My Vouchers not Found");
        }
        return myVouchers;
    }


    async createClaimVoucher(voucherId: string, user: any) {
        let randomString = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;

        for (let i = 0; i < 6; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
        }



        const voucher = await this.voucherModel.findOne({_id: new ObjectId(voucherId)});

        if(user.points < voucher.pointRequired){
            throw new NotFoundException("Not enough points");
        }

        user.points = user.points - voucher.pointRequired
        await user.save()

        const voucherTransaction = await this.voucherTransactionModel.create({
            voucherId: new ObjectId(voucherId),
            userId: new ObjectId(user._id),
            code: randomString
        });

        return voucherTransaction;
    }

}
