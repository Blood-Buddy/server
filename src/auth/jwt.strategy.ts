import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { Hospital } from "src/hospital/schemas/hospital.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Hospital.name)
        private hospitalModel: Model<Hospital>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any): Promise<User | Hospital> {
        try {
            const { id } = payload;
            const user = await this.userModel.findById(id);
            const hospital = await this.hospitalModel.findById(id);
            if(user) {
                return user
            } else if (hospital) {
                return hospital
            } else {
                throw new UnauthorizedException("You are not Authorized");
            }
        } catch (error) {
            console.error(`Error during JWT validation: ${error.message}`);
            throw new UnauthorizedException("Please login first to access this");
        }
    }
    
}
