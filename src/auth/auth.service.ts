import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterUserDto } from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { EditUserDto } from "./dto/editProfile.dto";
import { HospitalService } from "src/hospital/hospital.service";
import { LoginHospitalDto } from "src/hospital/dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private hospitalService: HospitalService
  ) {}

  async create(registerDto: RegisterUserDto) {
    try {
      const { name, nik, phone, address, province, email, bloodType, password } =
        registerDto;
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await this.userModel.create({
        name,
        nik,
        phone,
        address,
        province,
        email,
        bloodType,
        password: hashPassword,
      });
      return user;
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new UnauthorizedException("Email already registered");
      }
      throw new UnauthorizedException("Registration Failed");
    }
  }
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Invalid Email/Password");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid Email/Password");
    }
    const access_token = this.jwtService.sign({ id: user._id, name: user.name, role: user.role });
    return { access_token };
  }

  async hospitalLogin(loginHospital: LoginHospitalDto): Promise<{ access_token: string }> {
    const { email, password } = loginHospital;
    const hospital = await this.hospitalService.findHospitalEmail(email);
    if (!hospital) {
      throw new UnauthorizedException("Invalid Email/Password");
    }
    const isPasswordValid = bcrypt.compareSync(password, hospital.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid Email/Password");
    }
    const access_token = this.jwtService.sign({ id: hospital._id, name: hospital.name, role: hospital.role });
    return { access_token };

  }

  async getProfile(user: User) {
    const users = await this.userModel.aggregate([
      {
        $match: {
          _id: user._id,
        }
      },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "userId",
          as: "appointment",
        }
      }
    ]);
    if (!user) {
      throw new UnauthorizedException("User not Found");
    }
    return users;
  }

  async editProfile(user: User, updatedUser: EditUserDto): Promise<User> {
    // Check if the requesting user is authorized to update the profile
    const profile = await this.userModel.findByIdAndUpdate(
      user._id,
      { $set: updatedUser }, // Use $set to update only the specified fields
      { new: true, runValidators: true },
    );

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return profile;
  }
}
