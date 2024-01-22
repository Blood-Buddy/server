import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false
})
export class Voucher extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  pointRequired: number

  @Prop({ required: true })
  content: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
