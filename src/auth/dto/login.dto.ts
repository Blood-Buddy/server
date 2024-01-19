import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: "Please enter your email address"})
    @IsString()
    readonly email: string;
    @IsNotEmpty({message: "Please enter your password"})
    @IsString()
    readonly password: string;
}