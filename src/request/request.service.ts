import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './schema/request.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private requestModel: Model<Request>,
    ) {}

    async getRequestById(id: string): Promise<Request[]> {
        return await this.requestModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },{
                $lookup: {
                    from: 'hospitals',
                    localField: 'hospitalId',
                    foreignField: '_id',
                    as: 'hospital'
                }
            }
        ]);
    }
    async getRequests(): Promise<Request[]> {
        return await this.requestModel.find();
    }
}
