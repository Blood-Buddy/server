import { IsOptional, IsString, IsArray, IsPhoneNumber, IsNumber, IsInt, Min, IsNotEmpty, Length, ValidateNested, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class EditHospitalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email?: string;

  @IsOptional()
  @IsArray()
  address?: string[];

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BloodStockItemDto)
  @ApiProperty({ type: () => BloodStockItemDto, required: false })
  bloodStock?: BloodStockItemDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}
