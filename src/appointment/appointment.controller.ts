import {Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AuthGuard } from "@nestjs/passport";
import { Appointment } from "./schemas/appointment.schema";
import { createAppointmentDto } from "./dto/appointment.dto";

@Controller("appointment")
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get("/cron")
  // @UseGuards(AuthGuard())
  async getCron() {
    return await this.appointmentService.updateAppointmentStatusCron()
  }

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

  @Get(':id/completed')
  @UseGuards(AuthGuard("jwt-hospital"))
  async updateAppointmentStatus(
    @Param('id') id: string,
    // @Body('status') newStatus: string,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointmentStatusCompleted(id);
  }

  @Get("/history")
  @UseGuards(AuthGuard())
  async historyAppointment(@Req() req): Promise<Appointment[]> {
    return await this.appointmentService.historyAppointment(req.user);
  }

  @Get("/hospital")
  @UseGuards(AuthGuard('jwt-hospital'))
  async getAppointmentHospital(@Req() req): Promise<Appointment[]> {
    const hospital = await this.appointmentService.getAppointmentHospital(req.user);
    return hospital
  }

  @Get(':id/cancel')
  @UseGuards(AuthGuard())
  async cancelAppointment(
    @Param('id') id: string,
  ) {
    try {
      const updatedAppointment = await this.appointmentService.updateAppointmentStatusCancelled(
        id,
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



  @Put('/status/:id')
  @UseGuards(AuthGuard("jwt-hospital"))
  async updateAppointmentStatusHospital(
      @Param('id') id: string,
      @Body('status') status: string,
  ) {
    if (!status) {
      throw new NotFoundException('New status is required');
    }
    return this.appointmentService.updateAppointmentStatusHospital(id, status);
  }

}
