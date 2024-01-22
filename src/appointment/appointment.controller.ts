import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AuthGuard } from "@nestjs/passport";
import { Appointment } from "./schemas/appointment.schema";
import { createAppointmentDto } from "./dto/appointment.dto";

@Controller("appointment")
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAppointment(@Req() req): Promise<Appointment[]> {
    return await this.appointmentService.getAppointment(req.user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createAppointment(
    @Body()
    appointmentData: createAppointmentDto,
    @Req() req, 
  ): Promise<{appointment: Appointment; qrCode: string}> {
    return this.appointmentService.createAppointment(appointmentData, req.user);
  }

  @Patch(':id/update-status')
  @UseGuards(AuthGuard())
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') newStatus: string,
  ): Promise<Appointment> {
    if (!newStatus) {
      throw new NotFoundException('New status is required');
    }
    return this.appointmentService.updateAppointmentStatus(id, newStatus);
  }

  @Get("/history")
  @UseGuards(AuthGuard())
  async historyAppointment(@Req() req): Promise<Appointment[]> {
    return await this.appointmentService.historyAppointment(req.user);
  }
}
