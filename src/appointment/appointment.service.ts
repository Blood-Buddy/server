import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Appointment} from "./schemas/appointment.schema";
import {User} from "src/auth/schemas/user.schema";
import {createAppointmentDto} from "./dto/appointment.dto";
import * as qrCode from "qrcode";
import {Hospital} from "src/hospital/schemas/hospital.schema";
import {Request} from "src/request/schema/request.schema";
import ObjectId = Types.ObjectId;

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name)
        private appointmentModel: Model<Appointment>,
        @InjectModel(Request.name)
        private requestModel: Model<Request>
    ) {
    }

    async createAppointment(
        appointment: createAppointmentDto,
        user: User
    ): Promise<{ appointment: Appointment; qrCode: string }> {
        const requestId = new Types.ObjectId(appointment.requestId);
        const request = await this.requestModel.findById(requestId);
        const data: Partial<Appointment> = {
            ...appointment,
            requestId,
            hospitalId: request.hospitalId,
            userId: new Types.ObjectId(user._id),
        };
        const qrCodeString = await this.generateQRCode(data as Appointment);
        const res = await this.appointmentModel.create({
            ...data,
            qrCode: qrCodeString,
        });
        return {appointment: res, qrCode: qrCodeString};
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
          $or:[
            {
              userId: user._id,
              status: "pending"
            },
            {
              hospitalId: user._id,
              status: "pending"
            }
          ]
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $lookup: {
          from: "requests",
          localField: "requestId",
          foreignField: "_id",
          as: "request",
        }
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
                    $or: [
                        {
                            userId: user._id,
                            status: {$in: ["completed", "canceled"]}
                        },
                        {
                            hospitalId: user._id,
                            status: {$in: ["completed", "canceled"]}
                        }
                    ]
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
                    session: 1,
                    updatedAt: 1,
                    "User.name": 1,
                    "Hospital.name": 1,
                    "Hospital.address": 1,
                    "Hospital.phone": 1,
                    status: 1,
                },
            },
        ]);
    }

    async getAppointmentById(id) {
        let appointment = await this.appointmentModel.aggregate([
            {
                '$match': {
                    '_id': new ObjectId(id)
                }
            }, {
                '$lookup': {
                    'from': 'hospitals',
                    'localField': 'hospitalId',
                    'foreignField': '_id',
                    'as': 'hospital'
                }
            }, {
                '$unwind': {
                    'path': '$hospital'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }, {
                '$lookup': {
                    'from': 'requests',
                    'localField': 'requestId',
                    'foreignField': '_id',
                    'as': 'request'
                }
            }, {
                '$unwind': {
                    'path': '$request'
                }
            }
        ]);
        return appointment.length > 0 ? appointment[0] : []
    }
}
