import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false
})
export class VoucherTransaction extends Document {
    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    voucherId: string;

    @Prop({required: true})
    code: string;
}

export const VoucherTransactionSchema = SchemaFactory.createForClass(VoucherTransaction);
