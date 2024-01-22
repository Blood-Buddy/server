import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false
})
export class VoucherTransaction extends Document {
    @Prop({required: true})
    userId: Types.ObjectId;

    @Prop({required: true})
    voucherId: Types.ObjectId;

    @Prop({required: true})
    code: string;
}

export const VoucherTransactionSchema = SchemaFactory.createForClass(VoucherTransaction);
