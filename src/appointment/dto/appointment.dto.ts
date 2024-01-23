import { IsDateString, IsEmpty, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class createAppointmentDto {
    @IsDateString()
    readonly date: Date

    @IsNotEmpty()
    readonly session: number

    @IsNotEmpty()
    readonly requestId: Types.ObjectId

}