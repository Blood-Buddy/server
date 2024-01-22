import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './schema/request.schema';
import { Model } from 'mongoose';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private requestModel: Model<Request>,
    ) {}

    async getRequestById(id: string): Promise<Request> {
        return await this.requestModel.findById(id);
    }
    async getRequests(): Promise<Request[]> {
        return await this.requestModel.find();
    }
}
