import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {VoucherService} from './voucher.service';
import {RegisterHospitalDto} from './dto/register.dto';
import {Voucher} from './schemas/voucher.schema';
import {AuthGuard} from '@nestjs/passport';
import {Hospital} from "../hospital/schemas/hospital.schema";
import {VoucherTransaction} from "./schemas/vouchertransaction.schema";

@Controller('vouchers')
export class VoucherController {
    constructor(private voucherService: VoucherService) {
    }


    @Post('claim/:voucherId')
    @UseGuards(AuthGuard())
    async claimVoucher(@Param("voucherId") voucherId: string, @Req() req): Promise<VoucherTransaction> {
        const voucherTransaction = this.voucherService.createClaimVoucher(voucherId, req.user);
        return voucherTransaction
    }


    @Get('')
    async getAllVouchers(): Promise<Voucher[]> {
        const vouchers = this.voucherService.getAllVouchers();
        return vouchers
    }


    @Get('my-voucher')
    @UseGuards(AuthGuard())
    async getMyVouchers(@Req() req): Promise<VoucherTransaction[]> {
        const myVouchers = this.voucherService.getMyVouchers(req.user);
        return myVouchers
    }


}
