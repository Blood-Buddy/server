import { Body, Controller, Get, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AuthGuard } from "@nestjs/passport";
import { Appointment } from "./schemas/appointment.schema";

@Controller("appointment")
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get(":id")
  @UseGuards(AuthGuard())
  async getAppointment(
    @Param("id") 
    id: string) {
    return await this.appointmentService.getAppointment(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createAppointment(
    @Body() 
    appointmentData: Appointment
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(appointmentData);
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
}
