import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Hospital } from "./schemas/hospital.schema";
import * as mongoose from "mongoose";
import { RegisterHospitalDto } from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import { EditHospitalDto } from "./dto/editHospital.dto";

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name)
    private hospitalModel: mongoose.Model<Hospital>
  ) {}
  async create(hospital: RegisterHospitalDto) {
    try {
      const {
        name,
        email,
        address,
        phoneNumber,
        bloodStock,
        balance,
        password,
      } = hospital;
      const hashPassword = bcrypt.hashSync(password, 10);
      const newHospital = await this.hospitalModel.create({
        name,
        email,
        address,
        phoneNumber,
        bloodStock,
        balance,
        password: hashPassword,
      });
      return newHospital;
    } catch (error) {
      throw new UnauthorizedException("Registration Failed");
    }
  }

  async findHospital(hospital: Hospital) {
    const data = await this.hospitalModel.aggregate([
      {
        $match: {
          _id: hospital._id,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          address: 1,
          city: 1,
          phoneNumber: 1,
          bloodStock: 1,
          balance: 1,
          _id: 0,
        },
      },
    ]);
    if (!data) {
      throw new NotFoundException("Hospital not Found");
    }
    return data;
  }
  async findHospitalEmail(email: string) {
    const hospital = await this.hospitalModel.findOne({ email });
    if (!hospital) {
      throw new NotFoundException("Hospital not Found");
    }
    return hospital;
  }

  async editProfile(
    hospitalId: string,
    updateHospital: EditHospitalDto
  ): Promise<Hospital> {
    const updatedHospital = await this.hospitalModel.findByIdAndUpdate(
      hospitalId,
      updateHospital,
      { new: true, runValidators: true }
    );
    if (!updatedHospital) {
      throw new NotFoundException("Hospital not found");
    }
    return updatedHospital;
  }
}
