import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Hospital } from "./schemas/hospital.schema";
import { Model } from "mongoose";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(Hospital.name)
        private hospitalModel: Model<Hospital>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload) {
        const { id } = payload;
        const hospital = await this.hospitalModel.findById(id);
        if(!hospital) {
            throw new UnauthorizedException("Please login first to access this")
        }
        return hospital;
    }
}