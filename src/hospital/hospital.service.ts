import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hospital } from './schemas/hospital.schema';
import * as mongoose from 'mongoose';
import { RegisterHospitalDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs"
import { LoginHospitalDto } from './dto/login.dto';

@Injectable()
export class HospitalService {
    constructor(
        @InjectModel(Hospital.name)
        private hospitalModel: mongoose.Model<Hospital>,
        private jwtService: JwtService
    ) {}
    async create(hospital: RegisterHospitalDto) {
        try {
            const { name, email, address, phoneNumber, bloodStock, balance, password } = hospital;
            const hashPassword = bcrypt.hashSync(password, 10);
            const newHospital = await this.hospitalModel.create({
                name,
                email,
                address,
                phoneNumber,
                bloodStock,
                balance,
                password: hashPassword
            })
            return newHospital
        } catch (error) {
            throw new UnauthorizedException("Registration Failed")
        }
    }
    async login(loginDto: LoginHospitalDto) {
        const { email, password } = loginDto
        const hospital = await this.hospitalModel.findOne({ email })
        if (!hospital) {
            throw new UnauthorizedException('Invalid Email/Password')
        }
        const isPasswordValid = bcrypt.compareSync(password, hospital.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Email/Password')
        }
        const token = this.jwtService.sign({ id: hospital._id, name: hospital.name })
        return { token }
    }
}
