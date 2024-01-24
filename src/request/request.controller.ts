import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RequestService } from "./request.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "./schema/request.schema";

@Controller("request")
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  @UseGuards(AuthGuard("jwt-user"))
  async getRequests(@Req() req) {
    return await this.requestService.getRequests(req.user);
  }

  @Get("/hospital")
  @UseGuards(AuthGuard("jwt-hospital"))
  async getRequestHospitals(@Req() req): Promise<Request[]> {
    return await this.requestService.getRequestHospitals(req.user);
  }

  @Get(":id")
  @UseGuards(AuthGuard())
  async getRequestById(@Param("id") id: string) {
    return await this.requestService.getRequestById(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt-hospital"))
  async postRequest(@Body() body, @Req() req) {
    return await this.requestService.postRequest(body, req.user);
  }

}
