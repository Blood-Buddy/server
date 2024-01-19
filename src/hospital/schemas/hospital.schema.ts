import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false
})
export class Hospital extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [String], required: true })
  address: string[];

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    _id: false,
    type: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      O: { type: Number, default: 0 },
      AB: { type: Number, default: 0 },
    },
    default: {
      A: 0,
      B: 0,
      O: 0,
      AB: 0,
    },
  })
  bloodStock: Record<string, number>;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop()
  password: string;
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);
