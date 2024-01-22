import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { RegisterHospitalDto } from './dto/register.dto';
import { Voucher } from './schemas/voucher.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('vouchers')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}


  @Get('')
  async getAllVouchers(): Promise<Voucher[]> {
    const vouchers = this.voucherService.getAllVouchers();
    return vouchers
  }


  @Get('my-voucher')
  async getMyVouchers(): Promise<Voucher[]> {
    return []
  }

}
