import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Request extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true })
  hospitalId: Types.ObjectId;

  @Prop({
    type: {
      A: {
        request: { type: Number, default: 0 },
        collected: { type: Number, default: 0 },
      },
      B: {
        request: { type: Number, default: 0 },
        collected: { type: Number, default: 0 },
      },
      AB: {
        request: { type: Number, default: 0 },
        collected: { type: Number, default: 0 },
      },
      O: {
        request: { type: Number, default: 0 },
        collected: { type: Number, default: 0 },
      },
    },
    default: {
      A: { request: 0, collected: 0 },
      B: { request: 0, collected: 0 },
      AB: { request: 0, collected: 0 },
      O: { request: 0, collected: 0 }
    },
  })
  bloodType: Record<string, { request: number; collected: number }>;

  @Prop({ type: Number, default: 0 })
  totalRequest: number;

  @Prop({ type: Number, default: 0 })
  totalCollected: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  session: [];
}

export const RequestSchema = SchemaFactory.createForClass(Request);

