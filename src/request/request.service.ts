import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Request} from './schema/request.schema';
import {Model, Types} from 'mongoose';
import ObjectId = Types.ObjectId;
import {VoucherTransaction} from "../voucher/schemas/vouchertransaction.schema";
import mongoose from "mongoose";
import {Hospital} from "../hospital/schemas/hospital.schema";
import {User} from 'src/auth/schemas/user.schema';

const {Invoice: InvoiceClient} = require("xendit-node");

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private requestModel: Model<Request>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Hospital.name)
        private hospitalModel: mongoose.Model<Hospital>
    ) {
    }

    async getRequestById(id: string): Promise<Request> {
        const request = await this.requestModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            }, {
                $lookup: {
                    from: 'hospitals',
                    localField: 'hospitalId',
                    foreignField: '_id',
                    as: 'hospital'
                }
            },
            {
                $unwind: '$hospital'
            },
            {
                $lookup: {
                    from: 'appointments',
                    localField: '_id',
                    foreignField: 'requestId',
                    as: 'appointment'
                }
            }, {
                $unwind: `$appointment`
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'appointment.userId',
                    foreignField: '_id',
                    as: 'appointment.user'
                }
            },
            {
                $unwind: `$appointment.user`
            },
            {
                $group: {
                    _id: '$_id',
                    request: {$first: '$$ROOT'},
                    appointments: {$push: '$appointment'},
                }
            }
        ]);
        return request.length > 0 ? request[0].request : []
    }

    async getRequests(id: string): Promise<Request[]> {
        const user = (await this.userModel.findById(id)).province
        return await this.requestModel.aggregate([
              {
                $lookup: {
                  from: 'hospitals',
                  localField: 'hospitalId',
                  foreignField: '_id',
                  as: 'hospital',
                },
              },
              {
                $unwind: '$hospital',
              },
              {
                  $addFields: {
                    isProvince: {
                        $eq: ["$hospital.province", user]
                    }
                  }
              }, 
              {
                $sort: {
                    isProvince: -1,
                }
              },
              {
                $project: {
                    isProvince: 0
                }
              }
        ]);
    }

    async postRequest(body, hospital): Promise<Request> {
        let hospitalModel: any = await this.hospitalModel.findOne({_id: new ObjectId(hospital._id)});
        let price = body.totalRequest * 50000
        let availableBalance = hospitalModel.balance - hospitalModel.balanceLocked

        if (availableBalance < price) {
            throw new NotFoundException("Balance not enough");
        }

        let bloodType = {
            A: {
                request: 0,
                collected: 0
            },
            B: {
                request: 0,
                collected: 0
            },
            AB: {
                request: 0,
                collected: 0
            },
            O: {
                request: 0,
                collected: 0
            }
        };
        for (let blood in body.bloodType) {
            bloodType[blood]['request'] = body.bloodType[blood];
            bloodType[blood]['collected'] = 0;
        }

        // nambahin balanceLockednya
        hospitalModel.balanceLocked = hospitalModel.balanceLocked + price;
        hospitalModel.save()

        // create table requestnya
        let requestBlood = await this.requestModel.create({
            title: body.title,
            description: body.description,
            hospitalId: new ObjectId(hospital._id),
            bloodType: bloodType,
            totalRequest: body.totalRequest,
            date: body.date,
            totalCollected: 0,
            session: body.session,
        });

        return requestBlood
    }

    async getRequestHospitals(hospital: Hospital): Promise<Request[]> {
        return await this.requestModel.aggregate([
            {
                $match: {
                    hospitalId: new Types.ObjectId(hospital._id)
                }
            }
        ])
    }
    
    async createInvoice(body, hospital) {
        const xenditInvoiceClient = new InvoiceClient({secretKey: process.env.API_KEY})

        let data: any = {
            "amount": body.amount,
            "invoiceDuration": 172800,
            "externalId": `${hospital._id.toString()}`,
            "description": "Invoice Deposit Saldo",
            "currency": "IDR",
            "reminderTime": 1,
        }

        data = await xenditInvoiceClient.createInvoice({
            data
        })

        let result = {
            invoiceId: data.id,
            invoiceUrl: data.invoiceUrl
        }

        return result
    }

    async createDepositInvoice(body) {

        if(ObjectId.isValid(body.external_id) === false) {
            return "Invalid Hospital ID";
        }

        let balanceHospital = await this.hospitalModel.findOneAndUpdate({
            _id: new ObjectId(body.external_id)
        },{
            $inc: {
                balance: body.paid_amount
            }
        });

        return balanceHospital
    }

    async createCron() {
        let tes = await this.hospitalModel.create({
            name: "tes",
            email: "tes@gmail.com",
            address: "tes",
            phoneNumber: "tes",
            password: "tes",
        });
        return tes
    }
}
