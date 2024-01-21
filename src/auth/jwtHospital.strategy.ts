// jwt-hospital.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Model } from "mongoose";
import { Hospital } from "src/hospital/schemas/hospital.schema";

@Injectable()
export class JwtHospitalStrategy extends PassportStrategy(Strategy, 'jwt-hospital') {
    constructor(
        @InjectModel(Hospital.name)
        private hospitalModel: Model<Hospital>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any): Promise<Hospital> {
        try {
            const { id } = payload;
            const hospital = await this.hospitalModel.findById(id);
            if (!hospital) {
                throw new UnauthorizedException("You are not Authorized");
            }
            return hospital;
        } catch (error) {
            console.error(`Error during JWT validation for hospital: ${error.message}`);
            throw new UnauthorizedException("Hospital not found");
        }
    }
}
