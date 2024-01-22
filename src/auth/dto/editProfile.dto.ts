import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly nik?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly phone?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly province?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly bloodType?: string;

}