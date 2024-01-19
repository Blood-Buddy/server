import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Request extends Document {
  @Prop()
  title: string;
  @Prop()
  donorRequired: number;
  @Prop()
  hospitalId: Types.ObjectId;
  @Prop()
  bloodType: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);