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

  @Patch(':id/completed')
  @UseGuards(AuthGuard("jwt-hospital"))
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

  @Patch(':id/cancel')
  @UseGuards(AuthGuard())
  async cancelAppointment(
    @Param('id') id: string,
    @Body('newStatus') newStatus: string,
  ) {
    try {
      const updatedAppointment = await this.appointmentService.updateAppointmentStatus(
        id,
        newStatus,
      );

      return { success: true, appointment: updatedAppointment };
    } catch (error) {
      return { success: false, error: 'Failed to cancel appointment' };
    }
  }


  @Get(":id")
  @UseGuards(AuthGuard('jwt-hospital'))
  async getAppointmentById(@Param("id") id: string) {
    return await this.appointmentService.getAppointmentById(id);
  }
}
