import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Appointment } from "./schemas/appointment.schema";
import { User } from "src/auth/schemas/user.schema";
import { createAppointmentDto } from "./dto/appointment.dto";
import * as qrCode from "qrcode";
import { Hospital } from "src/hospital/schemas/hospital.schema";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>
  ) {}

  async createAppointment(
    appointment: createAppointmentDto,
    user: User
  ): Promise<{ appointment: Appointment; qrCode: string }> {
    const data: Partial<Appointment> = {
      ...appointment,
      hospitalId: new Types.ObjectId(appointment.hospitalId),
      userId: new Types.ObjectId(user._id),
    };
    const qrCodeString = await this.generateQRCode(data as Appointment);
    const res = await this.appointmentModel.create({
      ...data,
      qrCode: qrCodeString,
    });
    return { appointment: res, qrCode: qrCodeString };
  }

  private async generateQRCode(appointment: Appointment): Promise<string> {
    const qrData = JSON.stringify({
      appointment,
    });

    const qrCodeString = await qrCode.toDataURL(qrData);

    return qrCodeString;
  }
  async getAppointment(user: User | Hospital): Promise<Appointment[]> {
    return await this.appointmentModel.aggregate([
      {
        $match: {
          userId: user._id,
          status: "pending"
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "Hospital",
        },
      },
      {
        $unwind: {
          path: "$User",
        },
      },
      {
        $unwind: {
          path: "$Hospital",
        },
      },
      {
        $project: {
          _id: 0,
          session: 1,
          "User.name": 1,
          "Hospital.name": 1,
          status: 1,
        },
      },
    ]);
  }

  async updateAppointmentStatus(
    id: string,
    newStatus: string
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id);
    appointment.status = newStatus;
    return appointment.save();
  }

  async historyAppointment(user: User): Promise<Appointment[]> {
    return await this.appointmentModel.aggregate([
      {
        $match: {
          userId: user._id,
          status: {$in: ["completed", "canceled"]}
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "Hospital",
        },
      },
      {
        $unwind: {
          path: "$User",
        },
      },
      {
        $unwind: {
          path: "$Hospital",
        },
      },
      {
        $project: {
          _id: 0,
          session: 1,
          "User.name": 1,
          "Hospital.name": 1,
          status: 1,
        },
      },
    ]);
  }
}
