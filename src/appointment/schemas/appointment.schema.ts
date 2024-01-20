// appointment.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  session: number;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  hospitalId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: string;

  @Prop({ default: 'pending' })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
