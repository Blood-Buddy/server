import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectConnection, InjectModel, MongooseModule} from "@nestjs/mongoose";
import {Connection, Model, Types} from "mongoose";
import {Appointment} from "./schemas/appointment.schema";
import {User} from "src/auth/schemas/user.schema";
import {createAppointmentDto} from "./dto/appointment.dto";
import * as qrCode from "qrcode";
import {Hospital} from "src/hospital/schemas/hospital.schema";
import {Request} from "src/request/schema/request.schema";
import ObjectId = Types.ObjectId;
const { MongoClient } = require('mongodb');

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name)
        private appointmentModel: Model<Appointment>,
        @InjectModel(Request.name)
        private requestModel: Model<Request>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Hospital.name)
        private hospitalModel: Model<Hospital>,
        @InjectConnection() private connection: Connection
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
            _id: new Types.ObjectId(),
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
                    "Hospital.phoneNumber": 1,
                    status: 1,
                },
            },
        ]);
    }

    async getAppointmentById(id: string) {
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

    async getAppointmentHospital(id: string): Promise<Appointment[]> {
        const hospital = await this.hospitalModel.findById(id)
        return this.appointmentModel.aggregate([
          {
            $match: {
              hospitalId: hospital._id
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: "$user"
          }
        ])
    }


    async updateAppointmentStatusHospital(
        id: string,
        newStatus: string
    ) {


        const client = new MongoClient(process.env.DB_URI, {
            dbName: "BloodBuddy"
        });

        const session = await this.connection.startSession();
        // const session = client.startSession();
        let isError = false
        try {
            session.startTransaction();

            // update appointment status
            const appointment = await this.appointmentModel.findOne({_id: new ObjectId(id)});
            appointment.status = newStatus;
            await appointment.save({session})

            // rilis point ke tabel user
            let user = await this.userModel.findOne({_id: appointment.userId});
            user.points = user.points + 50;
            await user.save({session});

            // kurangin balance & balanceLocked di tabel hospital
            let hospital: any = await this.hospitalModel.findOne({_id: appointment.hospitalId});
            hospital.balance = hospital.balance - 50000;
            hospital.balanceLocked = hospital.balanceLocked - 50000;

            // tambah stok di tabel hospital
            hospital.bloodStock[user.bloodType] = hospital.bloodStock[user.bloodType] + 1;
            await hospital.save({session});

            // update collected blood di tabel request
            let request: any = await this.requestModel.findOne({_id: appointment.requestId});
            request.bloodType[user.bloodType].collected = request.bloodType[user.bloodType].collected + 1;
            request.totalCollected = request.totalCollected + 1;
            await request.save({session});

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.log(error)

            isError = true
        } finally {
            await session.endSession();

            if(isError){
                return 'error'
            }
            return 'success'
        }

    }

}
