import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";


@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any): Promise<User> {
        try {
            const { id } = payload;
            const user = await this.userModel.findById(id);
            if (!user || user.role !== "user") {
                throw new UnauthorizedException("You are not Authorized");
            }
            return user;
        } catch (error) {
            console.error(`Error during JWT validation: ${error.message}`);
            throw new UnauthorizedException("Please login first to access this");
        }
    }
    
}