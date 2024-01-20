import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name) 
        private appointmentModel: Model<Appointment>
    ) {}

    async createAppointment(appointment: Appointment): Promise<Appointment> {
        const createdAppointment = new this.appointmentModel(appointment);
        return createdAppointment.save();
    }

    async getAppointment(id: string): Promise<Appointment> {
       const appointment =  this.appointmentModel.findById(id)
       if (!appointment) {
           throw new NotFoundException("Appointmen not Found");
       }
       return appointment
    }

    async updateAppointmentStatus(id: string, newStatus: string): Promise<Appointment> {
        const appointment = await this.appointmentModel.findById(id);
        appointment.status = newStatus;
        return appointment.save();
      }
}
