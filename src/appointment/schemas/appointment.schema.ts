// appointment.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  session: number;

  @Prop()
  hospitalId: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  qrCode: string
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
