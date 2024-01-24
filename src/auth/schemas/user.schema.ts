import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false
})
export class User extends Document {
  @Prop()
  name: string;
  @Prop()
  nik: string;
  @Prop({ unique: [true, 'Email is already in use'] })
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  address: string;
  @Prop()
  province: string;
  @Prop()
  bloodType: string;
  @Prop({type: Number, default: 0})
  points: number;
  @Prop()
  password: string;
  @Prop({type: String, default: "user"})
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
