import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  
  @IsNotEmpty()
  @IsString()
  readonly nik: string;
  
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;
  
  @IsNotEmpty()
  @IsString()
  readonly phone: string;
  
  @IsNotEmpty()
  @IsString()
  readonly address: string;
  
  @IsNotEmpty()
  @IsString()
  readonly bloodType: string;

  @IsInt()
  readonly points: number;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}