import { Type } from 'class-transformer';
import { IsString, IsArray, IsPhoneNumber, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsEmpty, Length, ValidateNested, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class BloodStockItemDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ default: 0 })
  A: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ default: 0 })
  B: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ default: 0 })
  O: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ default: 0 })
  AB: number;
}
export class RegisterHospitalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsArray()
  address: string[];

  @IsNotEmpty()
  phoneNumber: string;

  @ValidateNested()
  @Type(() => BloodStockItemDto)
  @ApiProperty({ type: () => BloodStockItemDto })
  bloodStock: BloodStockItemDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;
}
