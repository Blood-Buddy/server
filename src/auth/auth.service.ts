import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(registerDto: RegisterUserDto) {
    try {
      const { name, nik, phone, address, email, bloodType, password } =
        registerDto;
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await this.userModel.create({
        name,
        nik,
        phone,
        address,
        email,
        bloodType,
        password: hashPassword,
      });
      return user;
    } catch (error) {
        if (error.code === 11000 || error.code === 11001) {
            throw new UnauthorizedException("Email already registered")
        }
        throw new UnauthorizedException("Registration Failed")
    }
  }
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid Email/Password');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Email/Password');
    }
    const token = this.jwtService.sign({ id: user._id, name: user.name });
    return { token };
  }
}
