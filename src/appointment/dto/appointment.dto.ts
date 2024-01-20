import { IsDateString, IsEmpty, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class createAppointmentDto {
    @IsDateString()
    readonly date: string

    @IsNotEmpty()
    readonly session: number

    @IsNotEmpty()
    readonly hospitalId: Types.ObjectId

    @IsEmpty()
    readonly userId: Types.ObjectId

    @IsEmpty()
    readonly status: string
}