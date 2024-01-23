import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { RequestService } from './request.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('request')
export class RequestController {
    constructor(private requestService: RequestService) {}

    @Get(':id')
    @UseGuards(AuthGuard())
    async getRequestById(@Param('id') id: string) {
        return await this.requestService.getRequestById(id);
    }

    @Get()
    @UseGuards(AuthGuard())
    async getRequests() {
        return await this.requestService.getRequests();
    }

    @Post()

    @UseGuards(AuthGuard('jwt-hospital'))
    async postRequest(@Body() body, @Req() req) {
        return await this.requestService.postRequest(body, req.user);
    }
}
