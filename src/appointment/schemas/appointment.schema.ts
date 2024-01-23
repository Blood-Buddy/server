// appointment.schema.ts

import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes, Types } from 'mongoose';
import { Request } from 'src/request/schema/request.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop()
  _id: Types.ObjectId

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  session: number;

  @Prop()
  hospitalId: Types.ObjectId;

  @Prop()
  requestId: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  qrCode: string
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

