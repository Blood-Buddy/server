// appointment.schema.ts

import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes, Types } from 'mongoose';
import { Request } from 'src/request/schema/request.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({type: Types.ObjectId, auto: true})
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

  @Prop()
  name: string

  @Prop()
  bloodType: string

  @Prop()
  nik: string

  @Prop()
  email: string

  @Prop()
  phoneNumber: string

  @Prop()
  address: string

  @Prop()
  province: string
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

